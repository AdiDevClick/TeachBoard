import type {
  ApiEndpointType,
  DataReshapeFn,
} from "@/components/Inputs/types/inputs.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { MouseEvent, PointerEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { FormMethod } from "react-router-dom";

type IsNever<T> = [T] extends [never] ? true : false;

type InferServerDataFromRoute<TRoute> = TRoute extends {
  dataReshape: (data: infer TData, ...args: infer _Args) => unknown;
}
  ? TData
  : unknown;

type InferViewDataFromRoute<TRoute> = TRoute extends {
  dataReshape: (...args: infer _Args) => infer TView;
}
  ? TView
  : unknown;

type InferServerDataFromReshapeFn<TFn> = TFn extends (
  data: infer TData,
  ...args: infer _Args
) => unknown
  ? TData
  : unknown;

type InferViewDataFromReshapeFn<TFn> = TFn extends (
  ...args: infer _Args
) => infer TView
  ? TView
  : unknown;

export type InferServerData<TRoute, TSubmitReshapeFn> =
  IsNever<TSubmitReshapeFn> extends true
    ? InferServerDataFromRoute<TRoute>
    : InferServerDataFromReshapeFn<TSubmitReshapeFn>;

export type InferViewData<TRoute, TSubmitReshapeFn> =
  IsNever<TSubmitReshapeFn> extends true
    ? InferViewDataFromRoute<TRoute>
    : InferViewDataFromReshapeFn<TSubmitReshapeFn>;

/**
 * Shared metadata shape passed around by command controllers.
 */
export type CommandHandlerMetaData = Record<string, unknown> & {
  task?: AppModalNames;
  apiEndpoint?: ApiEndpointType;
  dataReshapeFn?: DataReshapeFn;
};

/**
 * Parameters for the useCommandHandler hook
 */
export interface UseCommandHandlerParams<
  TFieldValues extends FieldValues = FieldValues,
  TRoute = unknown,
  TSubmitReshapeFn = never,
  TPageId extends AppModalNames = AppModalNames
> {
  /** Zod validated form instance */
  form: UseFormReturn<TFieldValues>;
  /** Identifier for the current page/module */
  pageId: TPageId;
  /** Optional API_ENDPOINTS entry used for type inference in `useCommandHandler`. */
  submitRoute?: TRoute;
  /** Optional submit reshape function used as an alternative inference anchor. */
  submitDataReshapeFn?: TSubmitReshapeFn;
}

/**
 * Parameters for the handleAddNewItem function
 */

export type HandleAddNewItemParams = {
  e?: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>;
} & CommandHandlerMetaData;

/**
 * Parameters for the handleSelectionCallback function
 */
export type HandleSelectionCallbackParams = {
  value: string;
  options: {
    mainFormField?: string;
    secondaryFormField?: string;
    /**
     * Extra payload saved alongside the selected value.
     */
    detailedCommandItem?: Record<string, unknown> & {
      isSelected?: boolean;
    };
    /** Defaults to "array" for backward compatibility with multi-selection fields. */
    validationMode?: "array" | "single";
  };
};

/**
 * Parameters for the handleOpeningCallback function
 *
 * T allows callers to pass a more specific metadata shape (e.g. Popover, Select)
 * metaData is intentionally partial: callers usually only provide a subset of FetchParams
 */
export type HandleOpeningCallbackParams<T extends CommandHandlerMetaData> = {
  open: boolean;
  metaData?: T & Partial<FetchParams>;
};

/**
 * Parameters for the handleSubmitCallback function
 */
export type HandleSubmitCallbackParams = {
  variables: MutationVariables;
  submitOpts?: {
    method?: FormMethod;
    endpointUrl?: string;
    dataReshapeFn?: DataReshapeFn;
    reshapeOptions?: unknown;
    silent?: boolean;
  };
};
