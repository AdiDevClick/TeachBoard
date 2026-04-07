import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type { AppModalNames } from "@/configs/app.config";
import type { STEP_FOUR_INPUT_CONTROLLERS } from "@/features/evaluations/create/steps/four/config/step-four.configs";
import type { EvaluationsView } from "@/features/evaluations/main/EvaluationsView";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import type { ApiEndpointType } from "@/types/AppInputControllerInterface";
import type { PageWithControllers } from "@/types/AppPagesInterface";

type endpoints = {
  apiEndpoint?: ApiEndpointType;
  dataReshapeFn?: (data: unknown) => unknown;
};

export type EvaluationsMainProps = Readonly<
  {
    task?: AppModalNames;
  } & endpoints
>;

export type EvaluationsViewControllerProps = Readonly<
  Omit<Parameters<typeof EvaluationsView>[0], "modalMode"> & {
    evaluationData?: DetailedEvaluationView | null;
    classData?: unknown;
  }
>;

/**
 * Type definition for the properties accepted by the EvaluationsView component.
 */
export type EvaluationsViewProps = Readonly<
  Omit<
    PageWithControllers<typeof STEP_FOUR_INPUT_CONTROLLERS>,
    "inputControllers"
  > & {
    /** Evaluation endpoint for fetching evaluation data */
    evalEndpoint?: typeof API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID;
    /** Data reshape function for processing fetched evaluation data */
    evalDataReshapeFn?: typeof API_ENDPOINTS.GET.EVALUATIONS.dataReshape;
    /** Class endpoint for fetching class data */
    classEndpoint?: typeof API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID;
    /** Data reshape function for processing fetched class data */
    classDataReshapeFn?: typeof API_ENDPOINTS.GET.CLASSES.dataReshapeSingle;
    /** Defined metadatas for the evaluation view - Part of the step four inputs */
    inputControllers?: typeof STEP_FOUR_INPUT_CONTROLLERS;
    /** The modal name for the class task */
    classTask?: AppModalNames;
  }
>;
