/**
 * @file TimeFieldProps type definition
 * @description Defines the props for the TimeField component, which is a form field for selecting time values. It includes properties for label, step, value, and an onValueChange callback, as well as any additional props that can be passed to the underlying Input component.
 */

import type { Input } from "@/components/ui/input";
import type { ComponentProps } from "react";

/**
 * TimeFieldProps defines the properties for the TimeField component.
 */
export type TimeFieldProps = Readonly<
  {
    /** The label for the time field */
    label: string;
    /** The step interval for time selection, in seconds (e.g., 900 for 15-minute intervals) */
    step?: number;
    /** The current value of the time field, in "HH:mm" format */
    value?: string;
    onValueChange?: (value?: string) => void;
  } & ComponentProps<typeof Input>
>;
