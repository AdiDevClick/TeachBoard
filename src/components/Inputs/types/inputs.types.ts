import type { Input } from "@/components/ui/input";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { FieldTypes } from "@/types/MainTypes";
import type { ComponentProps, HTMLInputTypeAttribute } from "react";
import type { FieldValues, Path } from "react-hook-form";

/**
 * Type representing an input item for forms.
 * @description All properties are required.
 *
 * You can use this type to define the structure of your form components.
 * Un exemple of a component using this type is:
 * {@link LoginForm}
 */
type BaseInputItem<T> = {
  name: Path<T>;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

/**
 * Input item requires either a title or a label (for components that only render labels).
 */
export type InputItem<T> =
  | (BaseInputItem<T> & { title: string; label?: string; description?: string })
  | (BaseInputItem<T> & { title?: string; label: string });

export type ApiEndpointType = string | ((id: number | string) => string);
// NOTE: this intentionally accepts `any[]` so endpoint reshapers with specific
// first parameter types (e.g. `DegreesFetch`) remain assignable here.
export type DataReshapeFn = (...args: any[]) => unknown;

type FetchingInputBase<T> = InputItem<T> & {
  apiEndpoint?: ApiEndpointType;
  dataReshapeFn?: DataReshapeFn;
  useButtonAddNew?: boolean;
  fullWidth?: boolean;
  creationButtonText?: string | boolean;
  label?: string;
  defaultValue?: string;
  id?: string;
  toolTipText?: string;
  multiSelection?: boolean;
};

/**
 * Variant used when a command palette / modal is available.
 * Ensures `task` is set whenever `useCommands` is enabled.
 */
export type CommandInputItem<T> = FetchingInputBase<T> & {
  useCommands: true;
  task: AppModalNames;
};

/**
 * Fetching input that does not rely on commands (default case).
 */
type NonCommandFetchingInputItem<T> = FetchingInputBase<T> & {
  useCommands?: false;
  task?: AppModalNames;
};

export type FetchingInputItem<T> =
  | CommandInputItem<T>
  | NonCommandFetchingInputItem<T>;

/**
 * Props for the LaballedInputForController component
 */
export type LabelledInputForControllerProps<T extends FieldValues> =
  FieldTypes<T>;

/**
 * HOC component type that wraps a component with react-hook-form Controller.
 */
export type LabelledInputProps = ComponentProps<typeof Input>;
