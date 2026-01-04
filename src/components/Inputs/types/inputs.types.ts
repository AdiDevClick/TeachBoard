import type { AppModalNames } from "@/configs/app.config.ts";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { ComponentPropsWithRef, HTMLInputTypeAttribute } from "react";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

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
  | (BaseInputItem<T> & { title: string; label?: string })
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

/** Props for the Inputs component */
export type ControlledInputsProps<T extends FieldValues> = {
  items: InputItem<T>[];
  form: UseFormReturn<T>;
} & ComponentPropsWithRef<"div">;

type LaballedInputStandAloneProps<T extends FieldValues> = InputItem<T>;

type HOCLaballedInputProps<T extends FieldValues> = InputItem<T> & {
  form: UseFormReturn<T>;
};

type HOCLaballedInputWithMapperProps<T extends FieldValues> =
  SafeListMapperProp<InputItem<T>> & {
    form: UseFormReturn<T>;
  };

/**
 * Props for the LaballedInputForController component
 *
 * @description This type allows for three different usage scenarios:
 * 1. Standalone usage with explicit `field` and `fieldState` props.
 * 2. Usage with a Higher-Order Component (HOC) where input item props are passed directly.
 * 3. Usage with a HOC in conjunction with a ListMapper, where input item props are provided via the mapper.
 */
export type LaballedInputForControllerProps<T extends FieldValues> = (
  | HOCLaballedInputWithMapperProps<T>
  | HOCLaballedInputProps<T>
  | LaballedInputStandAloneProps<T>
) & {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
} & Omit<ComponentPropsWithRef<"input">, "form">;
