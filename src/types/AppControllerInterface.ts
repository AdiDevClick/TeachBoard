import type { AppModalNames } from "@/configs/app.config.ts";
import type { UseCommandHandlerParams } from "@/hooks/database/types/use-command-handler.types.ts";
import type { UseFormReturn, FieldValues } from "react-hook-form";

type ApiEndpointType = UseCommandHandlerParams["submitRoute"];
type DataReshapeFn = UseCommandHandlerParams["submitDataReshapeFn"];

/**
 * Base props shared by controller components across the app.
 * - TForm: the form values type
 * - TPageId: the page/modal id (string literal or union)
 * - TSubmitReshapeFn: optional reshape function type used on POST
 */
export type AppControllerInterface<
  TForm extends FieldValues = FieldValues,
  TSubmitRoute = ApiEndpointType,
  TSubmitReshapeFn = DataReshapeFn,
> = Readonly<{
  className: string;
  formId: string;
  form: UseFormReturn<TForm>;
  pageId: AppModalNames;
  submitRoute?: TSubmitRoute;
  submitDataReshapeFn?: TSubmitReshapeFn;
}>;
