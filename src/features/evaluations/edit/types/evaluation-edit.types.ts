import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type { AppModalNames } from "@/configs/app.config";

type Eval = typeof API_ENDPOINTS.GET.EVALUATIONS;
type Class = typeof API_ENDPOINTS.GET.CLASSES;

/**
 * Type definition for the properties accepted by the EvaluationsView component.
 */
export type EvaluationEditProps = Readonly<{
  endpoints?: {
    /** Evaluation endpoint for fetching evaluation data */
    evalEndpoint: Eval["endpoints"]["BY_ID"];
    /** Class endpoint for fetching class data */
    classEndpoint: Class["endPoints"]["BY_ID"];
  };
  reshapeFns?: {
    /** Data reshape function for processing fetched evaluation data */
    evalDataReshapeFn: Eval["dataReshape"];
    /** Data reshape function for processing fetched class data */
    classDataReshapeFn: Class["dataReshapeSingle"];
  };
  tasks?: {
    /** The modal name for the class task */
    classTask: AppModalNames;
    /** The modal name for the evaluation task */
    evalTask: AppModalNames;
  };
}>;
