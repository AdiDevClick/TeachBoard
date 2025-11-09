/**
 * Type definitions for InpageTabs component
 */
type TabItem = {
  name: string;
  [key: string]: unknown;
};

export type InpageTabsProps = {
  datas: Record<string, TabItem>;
  value?: string;
  onValueChange?: (value: string) => void;
};
