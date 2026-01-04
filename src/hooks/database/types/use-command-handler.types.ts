import type { DataReshapeFn } from "@/components/Inputs/types/inputs.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { MouseEvent, PointerEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Parameters for the useCommandHandler hook
 */
export interface UseCommandHandlerParams<
  TFieldValues extends FieldValues = FieldValues
> {
  /** Zod validated form instance */
  form: UseFormReturn<TFieldValues>;
  /** Identifier for the current page/module */
  pageId: AppModalNames;
}

/**
 * Parameters for the handleAddNewItem function
 */
export type HandleAddNewItemParams<TInput = unknown> = {
  e?: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>;
  apiEndpoint?: TInput extends { apiEndpoint?: infer A } ? A : unknown;
  task: AppModalNames;
  dataReshapeFn?: TInput extends { dataReshapeFn?: infer D } ? D : unknown;
};

/**
 * Parameters for the handleSelectionCallback function
 */
export type HandleSelectionCallbackParams = {
  value: string;
  options: {
    mainFormField: string;
    secondaryFormField: string;
    detailedCommandItem?: {
      isSelected?: boolean;
    };
    /** Defaults to "array" for backward compatibility with multi-selection fields. */
    validationMode?: "array" | "single";
  };
};

/**
 * Parameters for the handleOpeningCallback function
 */
export type HandleOpeningCallbackParams<TInput = unknown> = {
  open: boolean;
  metaData?: Omit<HandleAddNewItemParams<TInput>, "e">;
};

/**
 * Parameters for the handleSubmitCallback function
 */
export type HandleSubmitCallbackParams = {
  variables: MutationVariables;
  endpointUrl: string;
  dataReshapeFn?: DataReshapeFn;
  reshapeOptions?: unknown;
};
