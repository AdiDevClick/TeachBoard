import type { StepFourFormSchema } from "@/features/evaluations/create/steps/four/models/step-four.models";

/**
 * Normalize the score value by converting it to a number and ensuring it's within the valid range.
 *
 * @param score The raw score value from the form, which can be a number or a string.
 *
 * @returns The normalized score as a number and ensures that it's between 0 and 100. If the input is invalid (e.g., negative, non-numeric), it returns null.
 */
function normalizeScore(score: unknown): number | null {
  const parsedScore = Number(score);
  if (!Number.isFinite(parsedScore) || parsedScore < 0) {
    return null;
  }
  return parsedScore <= 20 ? parsedScore * 5 : parsedScore;
}

/**
 * Build a map of student IDs to their normalized overall scores based on the provided score entries.
 *
 * @param scoreEntries - An array of tuples containing student IDs and their corresponding overall scores, derived from the form state.
 */
function buildNewScores(
  scoreEntries: [string, unknown][],
): Map<string, number> {
  const normalizedScoresByStudentId = new Map<string, number>();

  for (const [studentId, score] of scoreEntries) {
    const normalizedScore = normalizeScore(score);
    if (normalizedScore == null) continue;

    normalizedScoresByStudentId.set(studentId, normalizedScore);
  }

  return normalizedScoresByStudentId;
}

/**
 * Reshape the evaluations for submission by comparing the current evaluations with the new normalized scores and determining if any modifications were made.
 *
 * @param allPresentStudents  - An array of students who were present, including their existing evaluation data, used to match against the score entries and build the new evaluations array.
 * @param normalizedScoresByStudentId  - A map of student IDs to their normalized overall scores, used to update the evaluations with the new scores.
 *
 * @returns An object containing a boolean indicating whether any modifications were made to the evaluations and the new evaluations array containing the overallScore property to be submitted with the form.
 */
function reshapeEvaluationForSubmission(
  allPresentStudents: StepFourFormSchema["evaluations"],
  normalizedScoresByStudentId: Map<string, number>,
) {
  let isModified = false;

  const evaluations = allPresentStudents.map((studentEval) => {
    const nextScore = normalizedScoresByStudentId.get(studentEval.id);

    if (nextScore == null) return studentEval;

    if (studentEval.overallScore !== nextScore) {
      isModified = true;

      return {
        ...studentEval,
        overallScore: nextScore,
      };
    }

    return studentEval;
  }) satisfies StepFourFormSchema["evaluations"];

  return {
    isModified,
    evaluations,
  };
}
/**
 * Build a new evaluations array for form submission based on the updated overall scores and the list of present students.
 *
 * @param scoreEntries - An array of tuples containing student IDs and their corresponding overall scores, derived from the form state.
 * @param allPresentStudents - An array of students who were present, including their existing evaluation data, used to match against the score entries and build the new evaluations array.
 * @returns An object containing a boolean indicating whether any modifications were made to the evaluations and the new evaluations array containing the overallScore property to be submitted with the form.
 */
export function buildNewEvaluation(
  scoreEntries: [string, unknown][],
  allPresentStudents: StepFourFormSchema["evaluations"],
) {
  const normalizedScoresByStudentId = buildNewScores(scoreEntries);

  return reshapeEvaluationForSubmission(
    allPresentStudents,
    normalizedScoresByStudentId,
  );
}
