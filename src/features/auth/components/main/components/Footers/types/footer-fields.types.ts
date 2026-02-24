import type { WithStyledFormProps } from "@/components/HOCs/types/with-styled-form.types";
import type { AppModalNames } from "@/configs/app.config";
import type { FieldValues } from "react-hook-form";

/**
 * @fileoverview Types for the FooterFields component, which renders the submit button and a link to toggle between login and password recovery modes in the authentication flow.
 */

/**
 * Props for the FooterFields component, which renders the submit button and a link to toggle between login and password recovery modes in the authentication flow.
 */
export type FooterFieldsProps<TFormValues extends FieldValues = FieldValues> = {
  form: WithStyledFormProps<TFormValues>["form"];
  formId: WithStyledFormProps<TFormValues>["formId"];
  textToDisplay: WithStyledFormProps<TFormValues>["textToDisplay"];
  pageId: AppModalNames;
};
