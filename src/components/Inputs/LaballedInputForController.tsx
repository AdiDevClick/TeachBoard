import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import type { LaballedInputForControllerProps } from "@/components/Inputs/types/inputs.types";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  debugLogs,
  labelledInputContainsInvalid,
} from "@/configs/app-components.config.ts";
import type { FieldValues } from "react-hook-form";

/**
 * A labelled input component integrated with react-hook-form Controller.
 *
 * @param props - Props for the labelled input component
 * @returns
 */
export function LabelledInputForController<T extends FieldValues>(
  props: LaballedInputForControllerProps<T>
) {
  if (labelledInputContainsInvalid(props)) {
    debugLogs("LabelledInputForController");
    return null;
  }

  const { name, title, field, fieldState, form, ...rest } = props;

  return (
    <>
      <Label htmlFor={name ?? field.name}>{title}</Label>
      <Input
        required
        {...rest}
        {...field}
        id={name ?? field.name ?? "input-is-not-named"}
        aria-invalid={fieldState.invalid ?? false}
      />
    </>
  );
}

export const ControlledLabelledInput = withController(
  LabelledInputForController
);

export const ControlledInputList = withListMapper(ControlledLabelledInput);
