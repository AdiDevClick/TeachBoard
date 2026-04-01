import type { UUID } from "@/api/types/openapi/common.types";
import type { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController";

export type ScoreItem = {
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
   * The react-hook-form instance for managing form state
   */
  form: AverageFieldsProps["form"];
}>;

/**
 * Props for the AverageFields component, which displays the average scores of students in an evaluation.
 */
export type AverageFieldsProps = Readonly<{
  form: Parameters<typeof StepFourController>[0]["form"];
  students: ReadonlyArray<readonly [UUID, ScoreItem]>;
  title?: string;
  description?: string;
  placeholder?: string;
  viewMode?: boolean;
}>;
