import type { CommandSelectionItemProps } from "@/components/Command/types/command.types.ts";
import { ANIMATIONS_LOGS, DEV_MODE } from "@/configs/app.config.ts";
import type { UniqueSet } from "@/utils/UniqueSet.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

/**
 * Set form values after animation completes
 *
 * @param mainFormField - The main form field to set
 * @param secondaryFormField - The secondary form field to set
 * @param retrievedFormField - The retrieved form field values
 * @param values - The values to set
 * @param form - The react-hook-form instance managing the form state
 */
export function setValuesAfterAnimation<TFieldValues extends FieldValues>(
  mainFormField: Path<TFieldValues>,
  secondaryFormField: Path<TFieldValues>,
  retrievedFormField: UniqueSet<string, CommandSelectionItemProps["command"]>,
  values: PathValue<TFieldValues, Path<TFieldValues>>,
  form: UseFormReturn<TFieldValues>,
) {
  if (mainFormField) {
    form.setValue(mainFormField, values, {
      shouldValidate: true,
    });
  }

  if (secondaryFormField) {
    const secondaryValues = Array.from(
      retrievedFormField.entries(),
    ) as PathValue<TFieldValues, Path<TFieldValues>>;

    form.setValue(secondaryFormField, secondaryValues, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  }
}

/**
 * Handle the end of the transition animation
 *
 * @param e - The animation end event
 * @param retrievedFormField - The retrieved form field values
 * @param value - The value that was animated out
 * @returns False after handling the transition end event
 */
export function onTransitionEnd(
  e: Event,
  retrievedFormField: UniqueSet<string, CommandSelectionItemProps["command"]>,
  value: string,
) {
  preventDefaultAndStopPropagation(e);

  if (DEV_MODE && !ANIMATIONS_LOGS) {
    console.debug("animationPlayed");
  }

  retrievedFormField.delete(value);
  return false;
}

/**
 * Trigger the open/close animation on an HTML element
 *
 * @param htmlElement - The HTML element to animate
 * @returns True if the animation was triggered, false otherwise
 */
export function triggerAnimation(
  htmlElement: HTMLElement | Element | undefined,
) {
  if (DEV_MODE && !ANIMATIONS_LOGS) {
    console.debug("triggerAnimation called");
  }

  htmlElement?.classList.remove("opened");
  htmlElement?.classList.add("closed");

  return Boolean(htmlElement);
}

/**
 * Check and retrieve values based on validation mode
 *
 * @param validationMode - The validation mode, either "array" or "single"
 * @param retrievedFormField - The retrieved form field values
 *
 * @returns The processed values based on the validation mode
 */
export function retrieveValuesByMode(
  validationMode: "array" | "single",
  retrievedFormField: UniqueSet<string, CommandSelectionItemProps["command"]>,
) {
  let values: unknown = Array.from(retrievedFormField.keys());

  if (validationMode === "single") {
    if (Array.isArray(values) && values.length > 0) {
      values = values[0];
    } else {
      values = "";
    }
  }

  return values;
}
