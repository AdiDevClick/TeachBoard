import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import type { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type {
  EvaluationRehydrationPayload,
  NonPresentStudentsResult,
} from "@/features/evaluations/create/store/types/steps-creation-store.types";
import { parseToUuid } from "@/utils/utils";

/**
 * Generates a list of absent students names to display based on the evaluation data and non-present students result.
 *
 * @param students - The map of non-present students (key = studentId, value = student details).
 * @param evaluation - The evaluation data containing absence information.
 * 
 * @returns An object containing the list of absent students.

 */
export function studentPresence(
  students: NonPresentStudentsResult | null,
  evaluation: EvaluationRehydrationPayload,
): {
  students: DynamicTagsItemList;
} {
  const studentsPresence = Array.from(students?.values() ?? []);
  const absenceIds = evaluation?.absencesIds ?? [];

  if (absenceIds.length === 0) {
    return {
      students: [["Aucun", { id: "none" }] as const],
    };
  }

  return {
    students: studentsPresence,
  };
}

/**
 * Selects and formats class metadata for display and store hydration.
 *
 * @param classData - The raw class data to extract metadata from.
 *
 * @returns An object containing the selected class ID and details, or null if the data is invalid.
 */
export function selectClassMetas(classData: unknown) {
  try {
    const serializedClassData = JSON.stringify(classData);
    const parsedClass = JSON.parse(serializedClassData);

    const selectedClass = parsedClass[0]?.items;

    if (!selectedClass?.id) {
      throw new Error("Selected class data does not contain an id");
    }

    return {
      id: selectedClass.id,
      selectedClass,
    };
  } catch {
    return null;
  }
}

/**
 * Selects the class data from the store that matches the given class ID, ensuring referential equality for hydration.
 *
 * @param classId - The ID of the class to select.
 * @param classFromStore - The currently selected class from the store.
 *
 * @returns The class data from the store that matches the given class ID, or null if no match is found.
 */
export function selectClassFromStore(
  classFromStore: ReturnType<
    typeof useEvaluationStepsCreationStore.getState
  >["selectedClass"],
  classId?: string,
) {
  const parsedClassId = parseToUuid(classId);

  if (!parsedClassId || classFromStore?.id !== parsedClassId) {
    return null;
  }

  return classFromStore;
}
