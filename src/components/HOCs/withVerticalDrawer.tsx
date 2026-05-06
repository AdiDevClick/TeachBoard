import type {
  VerticalDrawerContentProps,
  VerticalDrawerFooterProps,
  VerticalDrawerHeaderProps,
  VerticalDrawerProps,
} from "@/api/contexts/types/context.types";
import { VerticalDrawerProvider } from "@/api/providers/VerticalDrawer.provider";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useVerticalDrawer } from "@/hooks/contexts/useVerticalDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";

/**
 * Higher-Order Component that wraps a given component with a vertical drawer layout.
 * It provides a consistent structure for drawers across the application, including a header, content area, and footer.
 *
 * @param drawerContent - Props for the DrawerContent component, which can include any additional content-specific properties.
 * @param drawerHeader - Props for the DrawerHeader component, including title and description.
 * @param drawerFooter - Props for the DrawerFooter component, including a close button configuration.
 * @param open - A boolean that controls whether the drawer is open or closed.
 * @param onClose - A callback function that is called when the drawer is closed.
 * @param children - The content to be rendered inside the drawer, typically the wrapped component.
 */
export function withVerticalDrawer<P extends object>(
  WrappedContent: ComponentType<P>,
) {
  function VerticalDrawer({
    drawerContent,
    drawerFooter,
    drawerHeader,
    drawerContentProps,
    children,
    open,
    onClose,
    ...drawer
  }: VerticalDrawerProps<P>) {
    const isMobile = useIsMobile();

    const onOpenChangeHandler = (open: boolean) => {
      if (!open) {
        onClose?.();
      }
    };

    return (
      <VerticalDrawerProvider
        value={{ drawerContent, drawerHeader, drawerFooter }}
      >
        <Drawer
          open={open}
          onOpenChange={onOpenChangeHandler}
          direction={isMobile ? "bottom" : "right"}
          {...drawer}
        >
          <DrawerContent {...drawerContentProps}>{children}</DrawerContent>
        </Drawer>
      </VerticalDrawerProvider>
    );
  }

  VerticalDrawer.Header = function Header(props: VerticalDrawerHeaderProps) {
    const {
      children,
      drawerTitle: { label = "", ...titleProps },
      drawerDescription: { label: desc = "", ...descriptionProps },
      ...headerProps
    } = {
      ...useVerticalDrawer().drawerHeader,
      ...props,
    };

    return (
      <DrawerHeader {...headerProps}>
        <DrawerTitle {...titleProps}>{label}</DrawerTitle>
        <DrawerDescription {...descriptionProps}>{desc}</DrawerDescription>
        {children}
      </DrawerHeader>
    );
  };

  VerticalDrawer.Content = function Content(
    props: VerticalDrawerContentProps<P>,
  ) {
    const { children, ...contentProps } = {
      ...useVerticalDrawer().drawerContent,
      ...props,
    };
    return (
      <>
        <WrappedContent {...(contentProps as P)} />
        {children}
      </>
    );
  };

  VerticalDrawer.Footer = function Footer(props: VerticalDrawerFooterProps) {
    const {
      children,
      drawerClose: { label: closeLabel = "", ...closeProps },
      ...footerProps
    } = {
      ...useVerticalDrawer().drawerFooter,
      ...props,
    };

    return (
      <DrawerFooter {...footerProps}>
        <DrawerClose asChild>
          <Button variant="outline" {...closeProps}>
            {closeLabel}
          </Button>
        </DrawerClose>
        {children}
      </DrawerFooter>
    );
  };

  createNameForHOC("withVerticalDrawer", WrappedContent, VerticalDrawer);
  return VerticalDrawer;
}
