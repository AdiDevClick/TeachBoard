import type { UUID } from "@/api/types/openapi/common.types";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { HTMLInputTypeAttribute } from "react";
import type { FieldValues, Path } from "react-hook-form";

/* eslint-disable no-unused-vars */
export type ApiEndpointType = string | ((id: number | string) => string);
// NOTE: this intentionally uses a bivariant function type so endpoint reshapers
// with specific first parameter types (e.g. `DegreesFetch`) remain assignable here.
export type DataReshapeFn = {
  bivarianceHack(data: unknown, ...args: unknown[]): unknown;
}["bivarianceHack"];
/* eslint-enable no-unused-vars */

/**
 * Shared metadata for inputs/selects/popovers that fetch or reshape data.
 */
export type AppInputControllerMeta = Readonly<{
  task?: AppModalNames;
  apiEndpoint?: ApiEndpointType;
  dataReshapeFn?: DataReshapeFn;
}>;

type AppInputControllerIdentity<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  type: HTMLInputTypeAttribute | "button";
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
  creationButtonText?: string | boolean;
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
