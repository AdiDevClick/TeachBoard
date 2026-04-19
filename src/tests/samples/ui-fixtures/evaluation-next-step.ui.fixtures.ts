import type { UUID } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { evaluationFlowFixture } from "@/tests/samples/ui-fixtures/evaluation-flow.ui.fixtures";
import { EvaluationFlowFixtureCreator } from "@/utils/FixtureCreator";

type EvaluationStepClassSummaryFixture = {
  selectedClass: ClassSummaryDto;
  studentId: UUID;
  taskId: UUID;
  moduleId: UUID;
  resetClassId: UUID;
};

const resetClassId = new EvaluationFlowFixtureCreator().generateUUID();

export function getEvaluationStepClassSummaryFixture(): EvaluationStepClassSummaryFixture {
  const baseClass = structuredClone(evaluationFlowFixture.classes.classA);
  const firstStudent = baseClass.students[0];
  const firstTemplate = baseClass.templates[0];
  const firstModule = firstTemplate?.modules?.[0];

  if (!firstStudent || !firstTemplate || !firstModule) {
    throw new Error(
      "[getEvaluationStepClassSummaryFixture] class fixture is missing required entries",
    );
  }

  const selectedClass: ClassSummaryDto = {
    ...baseClass,
    students: [firstStudent],
    templates: [{ ...firstTemplate, modules: [firstModule] }],
  };

  return {
    selectedClass,
    studentId: firstStudent.id,
    taskId: firstTemplate.id,
    moduleId: firstModule.id,
    resetClassId,
  };
}
