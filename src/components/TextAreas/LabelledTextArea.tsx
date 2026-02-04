import withController from "@/components/HOCs/withController";
import withListMapper from "@/components/HOCs/withListMapper";
import type {
  LabelledTextAreaForControllerProps,
  LabelledTextAreaProps,
} from "@/components/TextAreas/types/textareas.types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  debugLogs,
  labelledTextAreaContainsInvalid,
  labelledTextAreaForControllerContainsInvalid,
} from "@/configs/app-components.config";
import type { ComponentType } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * A labelled textarea component.
 *
 * @param name - The name of the textarea.
 * @param title - The label/title for the textarea.
 * @param props - Other props for the textarea.
 */
export function LabelledTextArea(props: LabelledTextAreaProps) {
  if (labelledTextAreaContainsInvalid(props)) {
    debugLogs("[LabelledTextArea]");
    return null;
  }

  const { name, title, ...rest } = props;
  const labelName = name ?? "input-is-not-named";
  return (
    <>
      <Label htmlFor={labelName}>{title}</Label>
      <Textarea {...rest} id={labelName} />
    </>
  );
}

/**
 * A labelled textarea component integrated with react-hook-form Controller.
 *
 * @param field - The field props from react-hook-form Controller.
 * @param fieldState - The field state from react-hook-form Controller.
 * @param props - Other props for the labelled textarea.
 * @returns
 */
function forController<P>(WrapperComponent: ComponentType<P>) {
  return function Component(
    props: P & LabelledTextAreaForControllerProps<FieldValues>,
  ) {
    if (labelledTextAreaForControllerContainsInvalid(props)) {
      debugLogs("[LabelledTextAreaForController]");
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

export const ControlledLabelledTextArea = withController(
  forController(LabelledTextArea),
);

export const ControlledLabelledTextAreaList = withListMapper(
  ControlledLabelledTextArea,
);
