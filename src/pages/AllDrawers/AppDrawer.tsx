import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useDialog } from "@/hooks/contexts/useDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AppDrawerProps } from "@/pages/AllDrawers/types/drawers.types";
import { sanitizeDOMProps } from "@/utils/props";
import {
  cloneElement,
  createElement,
  isValidElement,
  type ComponentProps,
  type ComponentType,
} from "react";

/**
 * AppDrawer component that integrates with DialogProvider and ContextDrawer.
 *
 * @description This uses the `ContextDrawer` to handle the drawer's open/close state and integrates with the DialogProvider to get additional options for the drawer content. The direction of the drawer is adjusted based on whether the user is on a mobile device or not.
 */
export function AppDrawer<T extends ComponentType>({
  appDrawerName,
  appDrawerProps,
  appDrawerContentProps,
  contentProps,
  children,
  onOpenChange,
}: AppDrawerProps<T>) {
  const {
    dialogOptions,
    onOpenChange: contextOnOpenChange,
    isDialogOpen,
  } = useDialog();
  const isMobile = useIsMobile();

  const dialogOpts = dialogOptions(appDrawerName) ?? {};
  const onOpenChangeHandler = onOpenChange ?? contextOnOpenChange;
  const isOpen = isDialogOpen(appDrawerName);

  const mergedProps = {
    ...appDrawerProps,
    direction: isMobile ? "bottom" : appDrawerProps?.direction || "right",
  } satisfies ComponentProps<typeof Drawer>;

  let renderedChildren;

  if (isValidElement(children)) {
    renderedChildren = cloneElement(children, {
      ...contentProps,
      ...dialogOpts,
    });
  } else if (typeof children === "function") {
    renderedChildren = createElement(children, {
      ...contentProps,
      ...dialogOpts,
    });
  } else {
    renderedChildren = children;
  }

  // Drawer does not accept "fadeFromIndex" eventhough the type definition suggests it does.
  const safeDrawerProps = sanitizeDOMProps(mergedProps, ["fadeFromIndex"]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={() => onOpenChangeHandler(appDrawerName)}
      {...safeDrawerProps}
    >
      <DrawerContent
        id={appDrawerName}
        data-dialog={appDrawerName}
        {...appDrawerContentProps}
      >
        {renderedChildren}
      </DrawerContent>
    </Drawer>
  );
}
