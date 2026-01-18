import type { SelectedClassModulesReturn } from "@/api/store/types/steps-creation-store.types.ts";
import type { StepThree } from "@/pages/Evaluations/create/steps/three/StepThree.tsx";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

/**
 * Props for Step Three Controller.
 *
 * @module StepThreeController
 */
export type StepThreeControllerProps = AppControllerInterface & {
  inputControllers?: unknown[];
  user: unknown;
  preparedStudentsTasksSelection: unknown;
  students: unknown[];
  selectedClass: unknown;
  tasks: unknown[];
  modules: SelectedClassModulesReturn;
} & Omit<Parameters<typeof StepThree>[0], "modalMode">;
