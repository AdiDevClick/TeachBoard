import type { TabContentProps } from "@/features/evaluations/create/components/Tabs/types/tabs.types";

/**
 * Types for the useTabContentHandler hook props
 */
export type UseTabContentHandlerProps = Pick<
  TabContentProps,
  "name" | "clickProps" | "onClick" | "index"
>;

export type TabContentHandlerState = {
  isNextDisabled: boolean;
  isLeaving: boolean;
  leavingDirection: "left" | "right" | null;
  tabName: string;
};
