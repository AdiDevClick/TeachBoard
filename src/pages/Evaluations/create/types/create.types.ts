/**
 * Types for the create evaluations page
 */

import type { ComponentType, MouseEvent, PropsWithChildren } from "react";

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
 * Types for the right content component props
 */
export type RightContentProps = {
  item: {
    content?: ComponentType;
    [key: string]: unknown;
  };
};

/**
 * Types for the create evaluations arrow click handler props
 */
export type CreateEvaluationArrowsClickHandlerProps = {
  e: MouseEvent<SVGElement>;
  index: number;
  arrayLength: number;
  setTabValue: (v: string | undefined) => void;
  tabValues: string[];
};
