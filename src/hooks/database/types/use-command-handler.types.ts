import type {
  ApiEndpointType,
  DataReshapeFn,
} from "@/components/Inputs/types/inputs.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { MouseEvent, PointerEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

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
  TMeta extends CommandHandlerMetaData = CommandHandlerMetaData
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
  endpointUrl: string;
  dataReshapeFn?: DataReshapeFn;
  reshapeOptions?: unknown;
};
