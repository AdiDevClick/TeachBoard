import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import type { LaballedInputForControllerProps } from "@/components/Inputs/types/inputs.types";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { FieldValues } from "react-hook-form";

/**
 * A labelled input component integrated with react-hook-form Controller.
 *
 * @param props - Props for the labelled input component
 * @returns
 */
export function LaballedInputForController<T extends FieldValues>(
  props: LaballedInputForControllerProps<T>
) {
  if (!("field" in props) || !("fieldState" in props)) {
    return null;
  }

  const { name, title, field, fieldState, ...rest } = props;

  return (
    <>
      <Label htmlFor={name ?? field.name}>{title}</Label>
      <Input
        required
        {...rest}
        {...field}
        id={name ?? field.name ?? "intput-is-not-named"}
        aria-invalid={fieldState.invalid ?? false}
      />
    </>
  );
}

export const ControlledLabelledInput = withController(
  LaballedInputForController
);

export const ControlledInputList = withListMapper(ControlledLabelledInput);
