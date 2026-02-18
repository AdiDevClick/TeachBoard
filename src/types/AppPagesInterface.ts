import type { AppModalNames } from "@/configs/app.config.ts";
import type { ComponentProps } from "react";

/**
 * An interface representing a page with input controllers.
 *
 * @description Pass-in a generic type to strictly type the input controllers array.
 */
export interface PageWithControllers<
  T = unknown,
> extends ComponentProps<"div"> {
  pageId?: AppModalNames;
  inputControllers?: readonly T[] | T;
  className?: string;
  modalMode?: boolean;
}
