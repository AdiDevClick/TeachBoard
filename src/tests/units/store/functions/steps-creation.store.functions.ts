import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import {
  CLASS_SUMMARY_FIXTURE,
  MODULE_ID,
  STUDENT_ONE_ID,
  SUBSKILL_ID,
  TASK_ID,
} from "@/tests/samples/store/steps-creation.fixtures";

export function initializeStudentOneWithScore(score = 80) {
  const store = useEvaluationStepsCreationStore.getState();

  store.setSelectedClass(CLASS_SUMMARY_FIXTURE);
  store.setStudentPresence(STUDENT_ONE_ID, true);
  store.setStudentTaskAssignment(TASK_ID, STUDENT_ONE_ID);

  const module = store.getSelectedModule(MODULE_ID);
  const subSkill = module?.subSkills.get(SUBSKILL_ID);

  if (!module || !subSkill) {
    throw new Error("Fixture module/sub-skill not found in test state");
  }

  store.setEvaluationForStudent(STUDENT_ONE_ID, {
    module,
    subSkill,
    score,
  });

  return { store, module, subSkill };
}
