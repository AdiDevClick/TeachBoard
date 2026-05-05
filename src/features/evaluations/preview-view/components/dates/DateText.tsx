import type { DateTextProps } from "@/features/evaluations/preview-view/components/dates/types/dates.types";
import { createDrawerDisplayDate } from "@/utils/utils";

/**
 * Component used to display a date with a specific text, typically used in the evaluation detail drawer to show the creation and update dates of an evaluation.
 *
 * @param text - The text to display before the date (e.g., "Créée le", "Dernière mise à jour le").
 * @param date - The date to display, in ISO format. If not provided or if the component is disabled, nothing will be rendered.
 * @param disabled - A boolean indicating whether the date should be displayed. If true, the component will render null.
 */
export function DateText({ text, date, disabled = true }: DateTextProps) {
  if (disabled || !date) {
    return null;
  }
  return (
    <p className="text-muted-foreground text-xs italic">
      {`${text} ${createDrawerDisplayDate(date)} \n`}
    </p>
  );
}
