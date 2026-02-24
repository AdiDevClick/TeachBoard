import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type { STEP_FOUR_INPUT_CONTROLLERS } from "@/features/evaluations/create/steps/four/config/step-four.configs";
import type { StepFourFormSchema } from "@/features/evaluations/create/steps/four/models/step-four.models";
import type { StepFour } from "@/features/evaluations/create/steps/four/StepFour";
import type { AppControllerInterface } from "@/types/AppControllerInterface";

/**
 * Types for the Step Four Controller component.
 *
 * NOTE: `PageWithControllers` allows `inputControllers` to be either `T` or
 * `readonly T[]`. The controller (and many downstream types) expect the
 * object form with named keys (e.g. `modules`, `comments`). To make the
 * controller props safe for indexed access we normalize the type to the
 * non-array variant here.
 */

export type StepFourInputControllers = typeof STEP_FOUR_INPUT_CONTROLLERS;

export type StepFourControllerProps = AppControllerInterface<
  StepFourFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_EVALUATION.endpoint,
  typeof API_ENDPOINTS.POST.CREATE_EVALUATION.dataReshape
> &
  Omit<Parameters<typeof StepFour>[0], "ModalMode" | "inputControllers"> & {
    inputControllers: StepFourInputControllers;
  };
