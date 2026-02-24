/**
 * Props for the AccordionItem component, which represents an item in an accordion list.
 */
export type AccordionItemProps = Readonly<{
  /** The value of the accordion item, used for controlling which item is open. */
  value: string;
  /** The name displayed on the accordion trigger. */
  name: string;
}>;
