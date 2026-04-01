import type { AppModalNames } from "@/configs/app.config";
import type { StepFourInputControllers } from "@/features/evaluations/create/steps/four/controller/types/step-four-controller.types";
import type { ApiEndpointType } from "@/types/AppInputControllerInterface";

type endpoints = {
  apiEndpoint?: ApiEndpointType;
  dataReshapeFn?: (data: unknown) => unknown;
};
export type EvaluationsMainProps = Readonly<
  {
    task?: AppModalNames;
  } & endpoints
>;

export type EvaluationsViewProps = Readonly<{
  apiEndpoint?: (id: string) => string;
  pageId?: AppModalNames;
  dataReshapeFn?: (data: unknown) => unknown;
  controllers?: StepFourInputControllers;
}>;
