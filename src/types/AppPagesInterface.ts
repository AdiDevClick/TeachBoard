import type { ComponentProps } from "react";

/**
 * An interface representing a page with input controllers.
 *
 * @description Pass-in a generic type to strictly type the input controllers array.
 */
export interface PageWithControllers<T = unknown>
  extends ComponentProps<"div"> {
  inputControllers: T[];
  className?: string;
  modalMode?: boolean;
}
