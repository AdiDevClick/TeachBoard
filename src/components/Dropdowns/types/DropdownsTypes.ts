import type { ComponentType, ReactNode } from "react";

export type DropdownItem = {
  title: ReactNode;
  icon?: ComponentType | null;
  divider?: boolean;
};

export type DropdownsProps<T extends DropdownItem = DropdownItem> =
  {} & Partial<T>;
