import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { AppDialogNames } from "@/configs/app.config";
import type { ComponentProps, ComponentType, PropsWithChildren } from "react";

/**
 * Type definition for the props of the AppDrawer component.
 *
 * @template T The type of the content component that will be rendered inside the drawer. This allows the AppDrawer to be flexible and render any type of content while still providing type safety for the props passed to that content.
 */
export type AppDrawerProps<T extends ComponentType> = Readonly<
  {
    appDrawerName: AppDialogNames;
    appDrawerProps?: Omit<
      ComponentProps<typeof Drawer>,
      "onOpenChange" | "fadeFromIndex"
    >;
    appDrawerContentProps?: ComponentProps<typeof DrawerContent>;
    contentProps?: ComponentProps<T>;
    onOpenChange?: (id: AppDialogNames) => void;
  } & PropsWithChildren<T>
>;
