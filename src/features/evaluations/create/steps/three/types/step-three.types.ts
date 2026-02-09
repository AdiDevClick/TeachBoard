import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { ShowStudentsEvaluation } from "@/features/evaluations/create/steps/three/components/step-three-wrappers.functions.tsx";
import type { StepThree } from "@/features/evaluations/create/steps/three/StepThree.tsx";
import type { AttendanceRecordCreationFormSchema } from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
import type {
  ClassModuleSubSkill,
  ClassTasks,
  SelectedClassModulesReturn,
  StudentWithPresence,
} from "@/features/evaluations/create/store/types/steps-creation-store.types.ts";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
import type { UniqueSet } from "@/utils/UniqueSet.ts";
import type { FieldValues } from "react-hook-form";

/**
 * Props for Step Three Controller.
 *
 * @module StepThreeController
 */
export type StepThreeControllerProps = AppControllerInterface<
  AttendanceRecordCreationFormSchema & FieldValues
> & {
  inputControllers?: readonly unknown[];
  user: unknown;
  students: StudentWithPresence[];
  selectedClass: ClassSummaryDto | null;
  tasks: UniqueSet<ClassTasks["id"], ClassTasks>;
  modules: SelectedClassModulesReturn;
} & Omit<Parameters<typeof StepThree>[0], "modalMode">;

/**
 * Props for Step Three Module Controller.
 *
 * @module StepThreeModuleController
 */
export type StepThreeModuleSelectionControllerProps = AppControllerInterface<
  AttendanceRecordCreationFormSchema & FieldValues
> & {
  inputControllers?: readonly unknown[];
  modules: SelectedClassModulesReturn;
} & Omit<Parameters<typeof StepThree>[0], "modalMode">;

/**
 * Props for Step Three Subskills Selection Controller.
 *
 * @module StepThreeSubskillsSelectionController
 */
export type StepThreeSubskillsSelectionControllerProps = AppControllerInterface<
  AttendanceRecordCreationFormSchema & FieldValues
> & {
  inputControllers?: readonly unknown[];
  user: unknown;
} & Omit<Parameters<typeof StepThree>[0], "modalMode">;

export type ShowStudentsEvaluationWithPreviousArrowProps = Parameters<
  typeof ShowStudentsEvaluation
>[0] & {
  onPreviousArrowClick: (_value: boolean) => void;
};

export type StepThreeCommonProps =
  | StepThreeControllerProps
  | StepThreeModuleSelectionControllerProps;
export type UseStepThreeHandlerProps =
  | SelectedClassModulesReturn
  | ClassModuleSubSkill[];
