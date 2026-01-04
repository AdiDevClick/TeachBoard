import type { inputs } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
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
export type HandleAddNewItemParams = {
  e?: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>;
  apiEndpoint?: (typeof inputs)[number]["apiEndpoint"];
  task: AppModalNames;
  dataReshapeFn?: (typeof inputs)[number]["dataReshapeFn"];
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
export type HandleOpeningCallbackParams = {
  open: boolean;
  metaData?: Omit<HandleAddNewItemParams, "e">;
};

/**
 * Parameters for the handleSubmitCallback function
 */
export type HandleSubmitCallbackParams = {
  variables: MutationVariables;
  endpointUrl: string;
  dataReshapeFn?: (...args: any[]) => unknown;
  reshapeOptions?: unknown;
};
