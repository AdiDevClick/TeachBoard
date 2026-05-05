import type { PropsWithChildren } from "react";

/**
 * Props for a section in the evaluation detail drawer
 */
export type DrawerSectionProps = Readonly<
  {
    title: string;
    separator?: boolean;
    disabled?: boolean;
  } & PropsWithChildren
>;
