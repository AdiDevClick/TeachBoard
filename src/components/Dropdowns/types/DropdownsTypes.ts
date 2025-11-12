import type { sidebarDatas } from "@/data/SidebarData.ts";

export type DropdownItem = (typeof sidebarDatas.user.settings)[number];
// export type DropdownItem = {
//   title: ReactNode;
//   icon?: ComponentType | null;
//   divider?: boolean;
// };

export type DropdownsProps<T extends DropdownItem = DropdownItem> = {
  userData: typeof sidebarDatas.user;
} & Partial<T>;
