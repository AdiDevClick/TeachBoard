import type { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import type { ComponentPropsWithRef } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

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
  type: string;
  placeholder: string;
};

/** Props for the Inputs component */
export type InputsProps<T extends FieldValues> = {
  items: InputItem<T>[];
  form: UseFormReturn<T>;
} & ComponentPropsWithRef<"div">;
