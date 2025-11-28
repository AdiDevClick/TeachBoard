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
export type InputItem<T> = {
  name: Path<T>;
  title: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  autoComplete?: string;
};

/** Props for the Inputs component */
export type ControlledInputsProps<T extends FieldValues> = {
  items: InputItem<T>[];
  form: UseFormReturn<T>;
} & ComponentPropsWithRef<"div">;

type LaballedInputStandAloneProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
} & InputItem<T>;

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
) &
  // ComponentPropsWithRef<"input">;
  Omit<ComponentPropsWithRef<"input">, "form">;
