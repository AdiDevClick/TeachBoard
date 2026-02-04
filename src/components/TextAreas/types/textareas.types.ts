import type { Textarea } from "@/components/ui/textarea";
import type { FieldTypes } from "@/types/MainTypes";
import type { ComponentProps } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * Props for the LabelledTextArea component integrated with react-hook-form Controller.
 */
export type LabelledTextAreaForControllerProps<T extends FieldValues> =
  FieldTypes<T>;

/**
 * Props for the LabelledTextArea component.
 */
export type LabelledTextAreaProps = ComponentProps<typeof Textarea>;
