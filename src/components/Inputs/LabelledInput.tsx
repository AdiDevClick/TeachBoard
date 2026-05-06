import type { LabelledInputProps } from "@/components/Inputs/types/inputs.types";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  debugLogs,
  labelledInputContainsInvalid,
} from "@/configs/app-components.config.ts";
import sanitizeDOMProps from "@/utils/props.ts";
import { cn } from "@/utils/utils";

/**
 * A labelled input component integrated with react-hook-form Controller.
 *
 * @param title - The title for the input label
 * @param props - Any Input type props
 */
export function LabelledInput(props: LabelledInputProps) {
  if (labelledInputContainsInvalid(props)) {
    debugLogs("LabelledInput", { type: "propsValidation", props });
    return null;
  }

  const { name, title, className, fullWidth = true, ...rest } = props;
  const safeProps = sanitizeDOMProps(rest, [
    "form",
    "onOpenChange",
    "onValueChange",
    "controllerFieldMeta",
    "fieldState",
  ]);
  const labelName = name ?? "input-is-not-named";
  const inputWidth = fullWidth ? "" : "w-fit!";

  return (
    <>
      <Label className={title ? "" : "hidden"} htmlFor={labelName}>
        {title}
      </Label>
      <Input
        className={cn(inputWidth, className)}
        required
        {...safeProps}
        id={labelName}
      />
    </>
  );
}
