/**
 * @fileoverview Types for the DateText component used in the evaluation details drawer.
 */

/**
 * Props for the DateText component, which displays a date with a specific text, typically used in the evaluation detail drawer to show the creation and update dates of an evaluation.
 */
export type DateTextProps = Readonly<{
  /** Text to display before the date */
  text: string;
  /** Date to display, in ISO format. If not provided or if the component is disabled, nothing will be rendered. */
  date?: string;
  /** A boolean indicating whether the date should be displayed. If true, the component will render null. */
  disabled?: boolean;
}>;
