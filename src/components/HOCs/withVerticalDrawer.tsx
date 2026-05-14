import type {
  VerticalDrawerContentProps,
  VerticalDrawerFooterProps,
  VerticalDrawerHeaderProps,
  VerticalDrawerProps,
} from "@/api/contexts/types/context.types";
import { VerticalDrawerProvider } from "@/api/providers/VerticalDrawer.provider";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useVerticalDrawer } from "@/hooks/contexts/useVerticalDrawer";
import { createNameForHOC } from "@/utils/utils";
import { type ComponentType } from "react";

/**
 * Higher-Order Component that wraps a given component with a vertical drawer layout.
 * It provides a consistent structure for drawers across the application, including a header, content area, and footer.
 *
 * @description The `withVerticalDrawer` HOC uses Compound design pattern to allow for flexible composition of the drawer's header, content, and footer.
 *
 * @param WrappedContent - The component to be rendered inside the drawer's content area. This component will receive any additional props passed to the `VerticalDrawer.Content` component.
 * @param drawerContent - Props for the DrawerContent component, which can include any additional content-specific properties.
 * @param drawerHeader - Props for the DrawerHeader component, including title and description.
 * @param drawerFooter - Props for the DrawerFooter component, including a close button configuration.
 * @param children - The content to be rendered inside the drawer, typically the wrapped component.
 */
export function withVerticalDrawer<P extends object>(
  WrappedContent: ComponentType<P>,
) {
  function VerticalDrawer({
    drawerContent,
    drawerFooter,
    drawerHeader,
    children,
  }: VerticalDrawerProps<P>) {
    return (
      <VerticalDrawerProvider
        value={{ drawerContent, drawerHeader, drawerFooter }}
      >
        {children}
      </VerticalDrawerProvider>
    );
  }

  VerticalDrawer.Header = function Header(props: VerticalDrawerHeaderProps) {
    const {
      children,
      drawerTitle: { label, ...titleProps } = {},
      drawerDescription: { label: desc, ...descriptionProps } = {},
      ...headerProps
    } = {
      ...useVerticalDrawer().drawerHeader,
      ...props,
    };

    return (
      <DrawerHeader {...headerProps}>
        <DrawerTitle {...titleProps}>{label ?? "Détails"}</DrawerTitle>
        <DrawerDescription {...descriptionProps}>
          {desc ?? "En cours de récupération..."}
        </DrawerDescription>
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
      drawerClose: { label: closeLabel = "Fermer", ...closeProps } = {},
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
