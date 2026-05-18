import type { UseFormReturn } from "react-hook-form";

/**
 * Type definition for the options accepted by the useDisabledForSubmit hook.
 *
 * @description This type is derived from the formState property of the UseFormReturn type from react-hook-form.
 * It includes all the properties of formState that are relevant for determining whether a submit button should be disabled.
 */

/**
 * The UseDisabledForSubmitOptions type is defined as the formState property of the UseFormReturn type from react-hook-form.
 */
export type UseDisabledForSubmitOptions = UseFormReturn["formState"];
