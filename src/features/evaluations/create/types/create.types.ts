/**
 * Types for the create evaluations page
 */

import type { useSidebar } from "@/components/ui/sidebar";
import type {
  Dispatch,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
} from "react";

/**
 * Types for the left content component props
 */
export type LeftContentProps = {
  item: {
    number: number;
    title: string;
    description: string;
  };
} & PropsWithChildren;

/**
 * Types for the create evaluations arrow click handler props
 */
export type CreateEvaluationArrowsClickHandlerProps = {
  e: MouseEvent<SVGElement | HTMLButtonElement>;
  index: number;
  arrayLength: number;
  setTabValue: (_v: string | undefined) => void;
  tabValues: string[];
  setSlideDirection: Dispatch<SetStateAction<"left" | "right">>;
} & ReturnType<typeof useSidebar>;
