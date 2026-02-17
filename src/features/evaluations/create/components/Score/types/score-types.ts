import type { UUID } from "@/api/types/openapi/common.types";
import type { ControlledLabelledInput } from "@/components/Inputs/exports/labelled-input";
import type { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import type { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController";
import type { ComponentProps } from "react";

type ScoreItem = {
  name: string;
  score: number;
};

/**
 * Props for the LabelledScoreInput component, which displays and allows editing of a student's average score.
 */
export type LabelledScoreInputProps = Readonly<{
  /** An object containing the student's name and their average score. */
  item: ScoreItem;
  /** The unique identifier for the student, used to track which student's score is being edited. */
  id: UUID;
  /**
   * The react-hook-form instance used to manage the form state for the score input.
   */
  form: ComponentProps<typeof ControlledLabelledInput>["form"];
}>;

/**
 * Props for the AverageFields component, which displays the average scores of students in an evaluation.
 */
export type AverageFieldsProps = Readonly<{
  form: Parameters<typeof StepFourController>[0]["form"];
  students: ReturnType<typeof useStepFourState>["allStudentsAverageScores"];
}>;
