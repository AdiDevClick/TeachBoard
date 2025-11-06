import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type InputItem<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  title: string;
  type?: string;
  placeholder?: string;
};

/** Props for the Inputs component */
export type InputsProps<TFieldValues extends FieldValues> = {
  items: Array<InputItem<TFieldValues>>;
  form: UseFormReturn<TFieldValues>;
};
