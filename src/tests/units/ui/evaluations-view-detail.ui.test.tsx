import { API_ENDPOINTS } from "@/configs/api.endpoints.config";

import { EvaluationsView } from "@/features/evaluations/main/EvaluationsView";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import {
  classObj,
  firsteval,
  secondeval,
} from "@/tests/samples/evaluations-payload.datas.tests";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  documentToHaveRoleWithName,
  getFetchCallsByUrl,
  rxExact,
  stubFetchRoutes,
} from "@/tests/test-utils/vitest-browser.helpers";
import type { RouteObject } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

type ScoresBySubSkill = Map<string, Map<string, number>>;
type ScoresByModule = Map<string, ScoresBySubSkill>;

const evaluationPayload = firsteval.data;
const classPayload = classObj.data;
const classDetails = classPayload.classe;
const secondEvaluationSinglePresentStudentId =
  secondeval.data.evaluations[0]?.studentId ?? classDetails.students[0]?.id;

if (!secondEvaluationSinglePresentStudentId) {
  throw new TypeError("Expected at least one student in class payload");
}

const secondEvaluationOnePresentPayload = {
  ...secondeval.data,
  absencesIds: classDetails.students
    .map((student) => student.id)
    .filter((studentId) => studentId !== secondEvaluationSinglePresentStudentId),
  evaluations: secondeval.data.evaluations.filter(
    (studentEvaluation) =>
      studentEvaluation.studentId === secondEvaluationSinglePresentStudentId,
  ),
};

const evaluationEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(
  evaluationPayload.id,
);
const classEndpoint = API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID(
  evaluationPayload.classId,
);

function normalizeText(value: string) {
  return value.replaceAll(/\s+/g, " ").trim().toLowerCase();
}

function buildRoutes(): RouteObject[] {
  return [
    {
      path: "/evaluations/:evaluationId",
      element: <EvaluationsView />,
    },
  ];
}

function EvaluationSwitchHarness() {
  const { evaluationId } = useParams();

  return (
    <>
      <Link to={`/evaluations/${evaluationPayload.id}`}>Voir évaluation 1</Link>
      <Link to={`/evaluations/${secondeval.data.id}`}>Voir évaluation 2</Link>
      <EvaluationsView key={evaluationId} />
    </>
  );
}

function buildRoutesWithSwitchHarness(): RouteObject[] {
  return [
    {
      path: "/evaluations/:evaluationId",
      element: <EvaluationSwitchHarness />,
    },
  ];
}

function installEvaluationDetailFetchStub(
  secondEvaluationPayload = secondeval.data,
) {
  stubFetchRoutes({
    getRoutes: [
      [evaluationEndpoint, evaluationPayload],
      [
        API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(secondeval.data.id),
        secondEvaluationPayload,
      ],
      [classEndpoint, classPayload],
    ],
    defaultGetPayload: [],
  });
}

function resolveStudentFullName(studentId: string) {
  const student = classDetails.students.find((item) => item.id === studentId);

  if (!student) {
    throw new TypeError(`Student '${studentId}' not found in class payload`);
  }

  return student.fullName;
}

function buildClassModuleLookup() {
  const modulesById = new Map<
    string,
    {
      name: string;
      subSkillsById: Map<string, string>;
    }
  >();

  for (const template of classDetails.templates) {
    for (const module of template.modules) {
      const existing = modulesById.get(module.id);

      if (existing) {
        for (const subSkill of module.subSkills) {
          existing.subSkillsById.set(subSkill.id, subSkill.name);
        }

        continue;
      }

      modulesById.set(module.id, {
        name: module.name,
        subSkillsById: new Map(
          module.subSkills.map((subSkill) => [subSkill.id, subSkill.name]),
        ),
      });
    }
  }

  return modulesById;
}

function buildExpectedScoresFromPayload(): ScoresByModule {
  const modulesById = buildClassModuleLookup();
  const expectedScores: ScoresByModule = new Map();

  for (const studentEvaluation of evaluationPayload.evaluations) {
    if (!studentEvaluation.isPresent) {
      continue;
    }

    const studentFullName = resolveStudentFullName(studentEvaluation.studentId);

    for (const moduleEvaluation of studentEvaluation.modules) {
      const moduleMeta = modulesById.get(moduleEvaluation.id);

      if (!moduleMeta) {
        throw new TypeError(
          `Module '${moduleEvaluation.id}' not found in class payload`,
        );
      }

      const moduleScores =
        expectedScores.get(moduleMeta.name) ??
        new Map<string, Map<string, number>>();
      expectedScores.set(moduleMeta.name, moduleScores);

      for (const subSkillEvaluation of moduleEvaluation.subSkills) {
        const subSkillName = moduleMeta.subSkillsById.get(
          subSkillEvaluation.id,
        );

        if (!subSkillName) {
          throw new TypeError(
            `SubSkill '${subSkillEvaluation.id}' not found for module '${moduleMeta.name}'`,
          );
        }

        const studentsScores =
          moduleScores.get(subSkillName) ?? new Map<string, number>();
        moduleScores.set(subSkillName, studentsScores);
        studentsScores.set(studentFullName, subSkillEvaluation.score);
      }
    }
  }

  return expectedScores;
}

function findSubSkillCard(subSkillName: string) {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("div.rounded-xl"),
  );

  return (
    cards.find((card) => {
      const header = card.querySelector<HTMLElement>(
        '[data-slot="item-header"]',
      );

      if (!header) {
        return false;
      }

      return (
        normalizeText(header.textContent ?? "") === normalizeText(subSkillName)
      );
    }) ?? null
  );
}

function getSliderValueForStudent(subSkillName: string, studentName: string) {
  const card = findSubSkillCard(subSkillName);

  if (!card) {
    return null;
  }

  const rows = Array.from(
    card.querySelectorAll<HTMLElement>('[data-slot="item"]'),
  );
  const matchingRow = rows.find((row) =>
    normalizeText(row.textContent ?? "").includes(normalizeText(studentName)),
  );

  if (!matchingRow) {
    return null;
  }

  const slider = matchingRow.querySelector<HTMLElement>('[role="slider"]');

  return slider?.getAttribute("aria-valuenow") ?? null;
}

function getAbsenceSectionText() {
  const section = document.getElementById("dynamic-tag-roles");

  return section?.textContent ?? "";
}

function getAbsentStudentNames(absenceIds: string[]) {
  return absenceIds.map(resolveStudentFullName);
}

async function expectAbsenceSectionToMatch(
  expectedAbsentIds: string[],
  unexpectedAbsentIds: string[] = [],
) {
  const expectedNames = getAbsentStudentNames(expectedAbsentIds).map(
    normalizeText,
  );
  const unexpectedNames = getAbsentStudentNames(unexpectedAbsentIds).map(
    normalizeText,
  );

  await expect
    .poll(() => {
      const absenceSectionText = normalizeText(getAbsenceSectionText());
      const includesExpectedNames = expectedNames.every((name) =>
        absenceSectionText.includes(name),
      );
      const excludesUnexpectedNames = unexpectedNames.every(
        (name) => !absenceSectionText.includes(name),
      );

      return includesExpectedNames && excludesUnexpectedNames;
    })
    .toBe(true);
}

function hasStudentOverallScore(studentName: string, score: number) {
  const pageText = normalizeText(document.body.textContent ?? "");
  const normalizedStudentName = normalizeText(studentName);
  const expectedScoreText = normalizeText(`${score} /20`);

  let nameIndex = pageText.indexOf(normalizedStudentName);

  while (nameIndex >= 0) {
    const nearbyText = pageText.slice(nameIndex, nameIndex + 220);

    if (nearbyText.includes(expectedScoreText)) {
      return true;
    }

    nameIndex = pageText.indexOf(
      normalizedStudentName,
      nameIndex + normalizedStudentName.length,
    );
  }

  return false;
}

setupUiTestState(null, {
  beforeEach: async () => {
    installEvaluationDetailFetchStub();
  },
});

describe("UI flow: evaluations detail view", () => {
  test("fetches correct ids and renders modules, scores, absences, and comments from payload", async () => {
    await render(
      <AppTestWrapper
        routes={buildRoutes()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );
    const callsPoints = [evaluationEndpoint, classEndpoint];

    callsPoints.forEach(async (endpoint) => {
      await expect
        .poll(() => getFetchCallsByUrl(endpoint, "GET").length > 0)
        .toBe(true);
    });

    expect(
      getFetchCallsByUrl(
        API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(secondeval.data.id),
        "GET",
      ),
    ).toHaveLength(0);

    for (const module of evaluationPayload.attendedModules) {
      await documentToHaveRoleWithName("button", rxExact(module.name));
    }

    const secondEvaluationOnlyModule = secondeval.data.attendedModules.find(
      (module) =>
        !evaluationPayload.attendedModules.some(
          (item) => item.id === module.id,
        ),
    );

    if (!secondEvaluationOnlyModule) {
      throw new TypeError(
        "Expected a module available only in second evaluation",
      );
    }

    expect(
      page
        .getByRole("button", { name: rxExact(secondEvaluationOnlyModule.name) })
        .query(),
    ).toBeNull();

    const expectedScores = buildExpectedScoresFromPayload();

    for (const [moduleName, subSkills] of expectedScores.entries()) {
      const moduleTrigger = page.getByRole("button", {
        name: rxExact(moduleName),
      });

      await userEvent.click(moduleTrigger);

      await expect
        .poll(() => moduleTrigger.query()?.dataset.state)
        .toBe("open");

      for (const [subSkillName, studentScores] of subSkills.entries()) {
        await expect.poll(() => !!findSubSkillCard(subSkillName)).toBe(true);

        for (const [studentName, score] of studentScores.entries()) {
          await expect
            .poll(() => getSliderValueForStudent(subSkillName, studentName))
            .toBe(String(score));
        }
      }
    }

    for (const studentEvaluation of evaluationPayload.evaluations) {
      if (
        !studentEvaluation.isPresent ||
        studentEvaluation.overallScore == null
      ) {
        continue;
      }

      const studentName = resolveStudentFullName(studentEvaluation.studentId);

      await expect
        .poll(
          () =>
            hasStudentOverallScore(
              studentName,
              Number(studentEvaluation.overallScore),
            ),
          { timeout: 5000 },
        )
        .toBe(true);
    }

    for (const absentStudentId of evaluationPayload.absencesIds) {
      const absentStudentName = resolveStudentFullName(absentStudentId);

      await expect
        .poll(() =>
          normalizeText(getAbsenceSectionText()).includes(
            normalizeText(absentStudentName),
          ),
        )
        .toBe(true);
    }

    await expect
      .poll(() => /\baucun\b/i.test(getAbsenceSectionText()))
      .toBe(false);

    await expect
      .poll(() => {
        const commentsField = page.getByLabelText(/^Commentaires$/i).query();

        return commentsField instanceof HTMLTextAreaElement
          ? commentsField.value
          : "";
      })
      .toBe(evaluationPayload.comments);
  });

  test("refreshes rendered data when navigating to another evaluation without F5", async () => {
    await render(
      <AppTestWrapper
        routes={buildRoutesWithSwitchHarness()}
        initialEntries={[`/evaluations/${secondeval.data.id}`]}
      />,
    );

    const roles = [
      ["heading", rxExact(secondeval.data.title)],
      ["button", rxExact(secondeval.data.title)],
    ] as const;

    roles.forEach(async ([role, name]) => {
      await documentToHaveRoleWithName(role, name);
    });

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 1/i }),
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 2/i }),
    );

    await documentToHaveRoleWithName("heading", rxExact(secondeval.data.title));

    const secondOnlyModule = secondeval.data.attendedModules.find(
      (module) =>
        !evaluationPayload.attendedModules.some(
          (item) => item.id === module.id,
        ),
    );

    if (!secondOnlyModule) {
      throw new TypeError(
        "Expected one module available only in second evaluation",
      );
    }

    await documentToHaveRoleWithName("button", rxExact(secondOnlyModule.name));

    await expect
      .poll(() => hasStudentOverallScore("Raz Fitz", 15), { timeout: 5000 })
      .toBe(true);

    for (const absentStudentId of secondeval.data.absencesIds) {
      const absentStudentName = resolveStudentFullName(absentStudentId);

      await expect
        .poll(() =>
          normalizeText(getAbsenceSectionText()).includes(
            normalizeText(absentStudentName),
          ),
        )
        .toBe(true);
    }
  });

  test("keeps absence names synchronized after 1 -> 2 -> 1 navigation", async () => {
    installEvaluationDetailFetchStub(secondEvaluationOnePresentPayload);

    const firstEvaluationOnlyPresentStudentId = evaluationPayload.evaluations
      .map((studentEvaluation) => studentEvaluation.studentId)
      .find((studentId) =>
        secondEvaluationOnePresentPayload.absencesIds.includes(studentId),
      );

    if (!firstEvaluationOnlyPresentStudentId) {
      throw new TypeError(
        "Expected one student present in first evaluation and absent in second evaluation",
      );
    }

    await render(
      <AppTestWrapper
        routes={buildRoutesWithSwitchHarness()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expectAbsenceSectionToMatch(evaluationPayload.absencesIds, [
      firstEvaluationOnlyPresentStudentId,
    ]);

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 2/i }),
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(secondEvaluationOnePresentPayload.title),
    );

    await expectAbsenceSectionToMatch(
      secondEvaluationOnePresentPayload.absencesIds,
    );

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 1/i }),
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expectAbsenceSectionToMatch(evaluationPayload.absencesIds, [
      firstEvaluationOnlyPresentStudentId,
    ]);
  });
});
