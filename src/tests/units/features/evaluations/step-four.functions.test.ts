import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import { buildNewEvaluation } from "@/features/evaluations/create/steps/four/functions/step-four.functions";
import type { StepFourFormSchema } from "@/features/evaluations/create/steps/four/models/step-four.models";
import { describe, expect, it } from "vitest";

const MODULE_ID = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174099");
const SUB_SKILL_ID = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174088");

function createEvaluation(
  id: StepFourFormSchema["evaluations"][number]["id"],
  overallScore: StepFourFormSchema["evaluations"][number]["overallScore"],
): StepFourFormSchema["evaluations"][number] {
  return {
    id,
    isPresent: true,
    overallScore,
    assignedTask: null,
    evaluations: {
      modules: [
        {
          id: MODULE_ID,
          name: "Module 1",
          subSkills: [
            {
              id: SUB_SKILL_ID,
              score: 75,
            },
          ],
        },
      ],
    },
  };
}

describe("buildNewEvaluation", () => {
  it("sets isModified to true when one overallScore changed", () => {
    const studentA = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174001");
    const studentB = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174002");

    const allPresentStudents = [
      createEvaluation(studentA, 60),
      createEvaluation(studentB, 75),
    ];

    const scoreEntries: [string, unknown][] = [
      [studentA, 12],
      [studentB, 18],
    ];

    const result = buildNewEvaluation(scoreEntries, allPresentStudents);

    expect(result.isModified).toBe(true);
    expect(result.evaluations[1]?.overallScore).toBe(90);
  });

  it("keeps isModified to false when scores are unchanged", () => {
    const studentA = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174011");
    const studentB = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174012");

    const allPresentStudents = [
      createEvaluation(studentA, 70),
      createEvaluation(studentB, 80),
    ];

    const scoreEntries: [string, unknown][] = [
      [studentA, 14],
      [studentB, 16],
    ];

    const result = buildNewEvaluation(scoreEntries, allPresentStudents);

    expect(result.isModified).toBe(false);
  });

  it("accepts already-normalized values up to 100 and keeps same score unchanged", () => {
    const studentA = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174031");

    const allPresentStudents = [createEvaluation(studentA, 75)];

    const scoreEntries: [string, unknown][] = [[studentA, 75]];

    const result = buildNewEvaluation(scoreEntries, allPresentStudents);

    expect(result.isModified).toBe(false);
    expect(result.evaluations[0]?.overallScore).toBe(75);
  });

  it("ignores values greater than 100 and keeps prior overallScore", () => {
    const studentA = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174041");

    const allPresentStudents = [createEvaluation(studentA, 65)];

    const scoreEntries: [string, unknown][] = [[studentA, 101]];

    const result = buildNewEvaluation(scoreEntries, allPresentStudents);

    expect(result.isModified).toBe(false);
    expect(result.evaluations[0]?.overallScore).toBe(65);
  });

  it("ignores invalid score entries and keeps existing overallScore", () => {
    const studentA = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174021");

    const allPresentStudents = [createEvaluation(studentA, 65)];

    const scoreEntries: [string, unknown][] = [[studentA, "not-a-score"]];

    const result = buildNewEvaluation(scoreEntries, allPresentStudents);

    expect(result.isModified).toBe(false);
    expect(result.evaluations[0]?.overallScore).toBe(65);
  });
});
