import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type InputItem<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  type?: string;
  placeholder?: string;
};

/** Props for the Inputs component */
export type InputsProps<T extends FieldValues> = {
  items: InputItem<T>[];
  form: UseFormReturn<T>;
};
