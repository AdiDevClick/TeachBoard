import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import type {
  LabelledInputForControllerProps,
  LabelledInputProps,
} from "@/components/Inputs/types/inputs.types";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  debugLogs,
  labelledInputContainsInvalid,
  labelledInputForControllerContainsInvalid,
} from "@/configs/app-components.config.ts";
import sanitizeDOMProps from "@/utils/props.ts";
import type { ComponentType, InputHTMLAttributes } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * A labelled input component integrated with react-hook-form Controller.
 *
 * @param props - Props for the labelled input component
 * @returns
 */
export function LabelledInput(props: LabelledInputProps) {
  if (labelledInputContainsInvalid(props)) {
    debugLogs("[LabelledInput]");
    return null;
  }

  const { name, title, ...rest } = props;
  const safeProps = sanitizeDOMProps(rest, ["form"]) as Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "form"
  >;

  const labelName = name ?? "input-is-not-named";

  return (
    <>
      <Label className={title ? "" : "hidden"} htmlFor={labelName}>
        {title}
      </Label>
      <Input required {...safeProps} id={labelName} />
    </>
  );
}

/**
 * A labelled input component integrated with react-hook-form Controller.
 *
 * @param field - The field props from react-hook-form Controller.
 * @param fieldState - The field state from react-hook-form Controller.
 * @param props - Other props for the labelled input.
 * @returns
 */
function forController<P>(WrapperComponent: ComponentType<P>) {
  return function Component(
    props: P & LabelledInputForControllerProps<FieldValues>,
  ) {
    if (labelledInputForControllerContainsInvalid(props)) {
      debugLogs("[LabelledInputForController]");
      return null;
    }

    const { field, fieldState, ...rest } = props;

    return (
      <WrapperComponent
        {...(rest as P)}
        {...field}
        aria-invalid={fieldState.invalid}
      />
    );
  };
}
export const LabelledInputForController = forController(LabelledInput);

export const ControlledLabelledInput = withController(
  LabelledInputForController,
);

export const ControlledInputList = withListMapper(ControlledLabelledInput);
