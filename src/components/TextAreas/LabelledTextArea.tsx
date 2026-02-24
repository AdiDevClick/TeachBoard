import type { LabelledTextAreaProps } from "@/components/TextAreas/types/textareas.types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  debugLogs,
  labelledTextAreaContainsInvalid,
} from "@/configs/app-components.config";

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
