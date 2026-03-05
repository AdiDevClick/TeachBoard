import type { UUID } from "@/api/types/openapi/common.types";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { HTMLInputTypeAttribute } from "react";
import type { FieldValues, Path } from "react-hook-form";

export type ApiEndpointType =
  | string
  | ((id: number | string) => string)
  | ((id: string) => string);
// NOTE: this intentionally uses a bivariant function type so endpoint reshapers
// with specific first parameter types (e.g. `DegreesFetch`) remain assignable here.
export type DataReshapeFn = {
  bivarianceHack(data: unknown, ...args: unknown[]): unknown;
}["bivarianceHack"];

/**
 * Shared metadata for inputs/selects/popovers that fetch or reshape data.
 */
export type AppInputControllerMeta = Readonly<{
  /**
   * The name of the command task associated with this input, if any. This is used for caching and identifying the query in React Query when fetching data for commands.
   * @default "none"
   */
  task?: AppModalNames;
  /**
   * The API endpoint to fetch data for this input, if applicable. This can be a string or a function that takes an ID and returns a string. If provided, the controller will fetch data from this endpoint when the input value changes.
   */
  apiEndpoint?: ApiEndpointType;
  /**
   * A function to reshape the data returned from the API before it is used by the input controller. This is useful for transforming the raw API response into a format that is compatible with the input component.
   */
  dataReshapeFn?: DataReshapeFn;
}>;

type AppInputControllerIdentity<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  id?: UUID | string;
};

type AppInputControllerLabel =
  | {
      title: string;
      label?: string;
      description?: string;
    }
  | {
      title?: string;
      label: string;
    };

type AppInputControllerOptions = {
  useButtonAddNew?: boolean;
  fullWidth?: boolean;
  creationButtonText?: string;
  toolTipText?: string;
  multiSelection?: boolean;
};

export type AppInputControllerBase<TFieldValues extends FieldValues> =
  AppInputControllerIdentity<TFieldValues> & AppInputControllerLabel;

export interface AppInputControllerInterface<
  TFieldValues extends FieldValues = FieldValues,
>
  extends
    AppInputControllerIdentity<TFieldValues>,
    AppInputControllerOptions,
    AppInputControllerMeta {
  title?: string;
  label?: string;
  description?: string;
  useCommands?: boolean;
}

export type AppInputControllerWithCommands<
  TFieldValues extends FieldValues = FieldValues,
> = AppInputControllerInterface<TFieldValues> &
  AppInputControllerLabel & {
    useCommands: true;
    task: AppModalNames;
  };

export type AppInputControllerWithoutCommands<
  TFieldValues extends FieldValues = FieldValues,
> = AppInputControllerInterface<TFieldValues> &
  AppInputControllerLabel & {
    useCommands?: false;
    task?: AppModalNames;
  };

export type AppInputControllerItem<
  TFieldValues extends FieldValues = FieldValues,
> =
  | AppInputControllerWithCommands<TFieldValues>
  | AppInputControllerWithoutCommands<TFieldValues>;

export type InputItem<TFieldValues extends FieldValues> =
  AppInputControllerBase<TFieldValues>;

export type FetchingInputItem<TFieldValues extends FieldValues> =
  AppInputControllerItem<TFieldValues>;
