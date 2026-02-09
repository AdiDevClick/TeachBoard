import type { WithStyledFormProps } from "@/components/HOCs/types/with-styled-form.types";
import type { MouseEvent } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * @fileoverview Types for the FooterFields component, which renders the submit button and a link to toggle between login and password recovery modes in the authentication flow.
 */

/**
 * Props for the FooterFields component, which renders the submit button and a link to toggle between login and password recovery modes in the authentication flow.
 */
export type FooterFieldsProps<TFormValues extends FieldValues> = Pick<
  WithStyledFormProps<TFormValues>,
  "form" | "formId" | "textToDisplay"
> & {
  onClick?: (e?: MouseEvent<HTMLElement>) => void;
};
