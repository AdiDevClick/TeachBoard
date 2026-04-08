import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type { AppModalNames } from "@/configs/app.config";

/**
 * Type definition for the properties accepted by the EvaluationsView component.
 */
export type EvaluationEditProps = Readonly<{
  /** Evaluation endpoint for fetching evaluation data */
  evalEndpoint?: typeof API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID;
  /** Data reshape function for processing fetched evaluation data */
  evalDataReshapeFn?: typeof API_ENDPOINTS.GET.EVALUATIONS.dataReshape;
  /** Class endpoint for fetching class data */
  classEndpoint?: typeof API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID;
  /** Data reshape function for processing fetched class data */
  classDataReshapeFn?: typeof API_ENDPOINTS.GET.CLASSES.dataReshapeSingle;
  /** The modal name for the class task */
  classTask?: AppModalNames;
  /** The modal name for the evaluation task */
  evalTask?: AppModalNames;
}>;
