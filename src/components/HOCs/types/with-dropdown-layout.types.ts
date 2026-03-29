import type { DropdownMenuLayoutContextType } from "@/api/contexts/types/context.types";
import type {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ComponentProps } from "react";

/**
 * Props for the withDropdownLayout HOC.
 *
 * @template C - Props type for the wrapped component.
 */
export type DropdownLayoutProps<C> = {
  menu?: DropdownMenuLayoutContextType<C>;
  /** Props for the wrapped component */
  rest?: C;
} & ComponentProps<typeof DropdownMenu>;

/**
 * Props for the DropdownMenuTrigger component within the withDropdownLayout HOC.
 */
export type MenuTrigger = ComponentProps<typeof DropdownMenuTrigger>;

/**
 * Props for the DropdownMenuContent component within the withDropdownLayout HOC.
 */
export type MenuContent = ComponentProps<typeof DropdownMenuContent>;
