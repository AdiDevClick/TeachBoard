import type { sidebarDatas } from "@/data/SidebarData";

/** Side button props for the quick access menu */
export type NavQuickButtonProps = {
  item?: {
    icon: NonNullable<
      (typeof sidebarDatas)["navMain"]["menus"][number]["quickButton"]
    >["icon"];
  };
};
