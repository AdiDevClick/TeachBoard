import type { TabContentProps } from "@/features/evaluations/main/components/Tabs/types/tabs.types";

/**
 * Types for the useTabContentHandler hook props
 */
export type UseTabContentHandlerProps = Pick<
  TabContentProps,
  "name" | "clickProps" | "onClick" | "index" | "tabValue"
>;

/**
 * Types for the tab evaluation state used in the Create Evaluations page navigation logic
 */
export type TabEvalState = {
  slideDirection: "left" | "right";
  tabsSeen: Set<string>;
};

export type TabContentHandlerState = {
  isNextDisabled: boolean;
  leavingDirection: "left" | "right" | null;
  tabName: string;
  isAnimating?: boolean;
  /** optional values used while animating / navigating */
  nextIndex?: number;
  newTabValue?: string;
};
