import type { StudentWithPresence } from "@/features/evaluations/create/store/types/steps-creation-store.types";

/**
 * Build a new evaluations array for form submission based on the updated overall scores and the list of present students.
 *
 * @param scoreEntries - An array of tuples containing student IDs and their corresponding overall scores, derived from the form state.
 * @param allPresentStudents - An array of students who were present, including their existing evaluation data, used to match against the score entries and build the new evaluations array.
 * @returns An object containing a boolean indicating whether any modifications were made to the evaluations and the new evaluations array containing the overallScore property to be submitted with the form.
 */
export function buildNewEvaluation(
  scoreEntries: [string, unknown][],
  allPresentStudents: StudentWithPresence[],
) {
  let isModified = false;
  return {
    isModified,
    evaluations: scoreEntries.map(([studentId, score]) => {
      const studentEval = allPresentStudents.find(
        (student) => student.id === studentId,
      );
      if (studentEval) {
        if (studentEval.overallScore !== score) {
          isModified = true;
        }

        return {
          ...studentEval,
          overallScore: score,
        };
      }
      return null;
    }),
  };
}
