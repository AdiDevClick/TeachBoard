/**
 * Types for the create evaluations page
 */

import type { ComponentType } from "react";

/**
 * Types for the left content component props
 */
export type LeftContentProps = {
  item: {
    number: number;
    title: string;
    description: string;
  };
};

export type RightContentProps = {
  item: {
    content?: ComponentType;
    [key: string]: unknown;
  };
};
