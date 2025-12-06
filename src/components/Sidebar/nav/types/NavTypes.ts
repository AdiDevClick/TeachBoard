import type { dataContext } from "@/api/providers/types/SidebarDataProviderTypes.ts";
import type {
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar.tsx";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type {
  ComponentProps,
  ComponentPropsWithRef,
  ReactElement,
  ReactNode,
} from "react";

/**
 * All types related to the sidebar navigation
 *
 * @description These types rely on the exported `dataContext` type
 * (defined in `@/api/providers/types/SidebarDataProviderTypes.ts`) to
 * ensure consistency with the sidebar data structure. Use the
 * {@link dataContext} reference — the doc generator should link to the
 * exported symbol when `SidebarDataProviderTypes.ts` is included in the
 * documentation build.
 *
 * If you change the structure of `sidebarDatas`, make sure to update
 * the `dataContext` type in `SidebarDataProviderTypes.ts` and re-run
 * your documentation generator so the link gets updated.
 */
export type NavMainMenuItem = NavMainProps["items"]["menus"][number];

type NavSecondaryMenuItem = dataContext["navSecondary"][number];
type SidebarHeader = dataContext["sidebarHeader"];
type QuickButton = NonNullable<NavMainMenuItem["quickButton"]>;

type SubMenus = NonNullable<NavMainMenuItem["subMenus"]>;

type GenericMenuItemProps<T> = {
  item: T;
  setStyle: (props: SetStyleMenuProps) => string;
};

/** Props for the main navigation component */
export type NavMainProps = {
  items: dataContext["navMain"];
};

/** Props for the set style menu */
export type SetStyleMenuProps = {
  isQuickButtonEnabled?: QuickButton["enabled"];
  isMenu: boolean;
};

/** Props for the collapsible menu */
export type CollapsibleMenuProps = GenericMenuItemProps<NavMainMenuItem>;

/** Props for the collapsible menu item */
export type CollapsibleMenuItemProps<T = NavMainMenuItem> =
  GenericMenuItemProps<T> & Partial<T>;

/** Props for the menu content */
export type MenuContentProps = GenericMenuItemProps<NavMainMenuItem> &
  ComponentPropsWithRef<typeof SidebarMenuButton>;

/** Props for the secondary menu */
export type SecondaryProps = ComponentPropsWithRef<typeof SidebarGroup>;

/** Props for the secondary navigation */
export type NavSecondaryProps<T = NavSecondaryMenuItem> = Omit<
  GenericMenuItemProps<T>,
  "setStyle"
> &
  Partial<T>;

/** Props for the sidebar header */
export type SidebarHeaderProps = {
  item: SidebarHeader;
};

/** Generic props for the buttons group list */
export type ButtonsGroupListProps<T = NavMainMenuItem | NavSecondaryMenuItem> =
  ComponentPropsWithRef<typeof SidebarGroup> & {
    children:
      | ReactElement<Partial<{ item: T; index: number }>>
      | ((item: T, index: number) => ReactNode);
    label?: string;
    items: T[];
  };

/** Props for the collapsible submenus contents component */
export type CollapsibleContentsProps = {
  subMenus: SubMenus;
};

/** Props for the submenu button component
 * @description This could be used with ListMapper or as a standalone component
 */
export type SubMenuButtonProps<
  T extends Record<string, unknown> = SubMenus[number]
> = ComponentProps<typeof SidebarMenuButton> & (T | SafeListMapperProp<T>);
