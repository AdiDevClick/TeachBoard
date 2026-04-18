import type { UUID } from "@/api/types/openapi/common.types";
import type { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController";
import type { PropsWithChildren } from "react";

export type ScoreItem = {
  /** The name of the student associated with this score. */
  name: string;
  /** The final score for the student. This can be overridden by the user or will be the same as the original score. */
  score: number;
  /** A saved version of the student's original score. Calculated average based on their performance. */
  originalScore: number;
};

/**
 * Props for the LabelledScoreInput component, which displays and allows editing of a student's average score.
 */
export type LabelledScoreInputProps = Readonly<
  Pick<LabelledScoreProps, "item"> & {
    /** The unique identifier for the student, used to track which student's score is being edited. */
    id: UUID;
    /**
     * The react-hook-form instance for managing form state
     */
    form: AverageFieldsProps["form"];
  }
>;

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

/**
 * LabelledScore component for displaying the average score of a student with a label.
 *
 * @param item - The score item containing the student's name and their average score.
 * @param children - The content to be displayed as the score value, allowing for flexibility in how the score is rendered.
 */
export type LabelledScoreProps = Readonly<
  {
    /** An object containing the student's name and their average score. */
    item: ScoreItem;
  } & PropsWithChildren
>;
