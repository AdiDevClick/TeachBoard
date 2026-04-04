import type { UUID } from "@/api/types/openapi/common.types";
import type { LabelledScoreProps } from "@/features/evaluations/create/components/Score/LabelledScore";
import type { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController";
import type { PropsWithChildren } from "react";

export type ScoreItem = {
  name: string;
  score: number;
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
