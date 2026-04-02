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
import { useState, type ComponentType } from "react";

export function withVerticalDrawer<P extends object>(
  WrappedContent: ComponentType<P>,
) {
  function VerticalDrawer(props: P) {
    const isMobile = useIsMobile();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { content, header, footer, ...drawer } = props;

    return (
      <VerticalDrawerProvider value={{ content, header, footer }}>
        <Drawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          direction={isMobile ? "bottom" : "right"}
          {...drawer}
        >
          {props.children}
        </Drawer>
      </VerticalDrawerProvider>
    );
  }

  VerticalDrawer.Header = function Header(props) {
    const { description, title, header } = useVerticalDrawer();
    const { ...headerProps } = { ...header, ...props };
    const { title: label, ...titleProps } = title;
    const { description: desc, ...descriptionProps } = description;

    return (
      <DrawerHeader {...headerProps}>
        <DrawerTitle {...titleProps}>{label}</DrawerTitle>
        <DrawerDescription {...descriptionProps}>{desc}</DrawerDescription>
        {props.children}
      </DrawerHeader>
    );
  };

  VerticalDrawer.Content = function Content(props) {
    const { content } = useVerticalDrawer();
    const { ...contentProps } = { ...content, ...props };
    return (
      <DrawerContent>
        <WrappedContent {...rest} {...contentProps} />
        {props.children}
      </DrawerContent>
    );
  };

  VerticalDrawer.Footer = function Footer(props) {
    const { footer, close } = useVerticalDrawer();
    const { ...footerProps } = { ...footer, ...props };
    const { closeLabel, ...closeProps } = close;

    return (
      <DrawerFooter {...footerProps}>
        <DrawerClose asChild>
          <Button variant="outline" {...closeProps}>
            {closeLabel}
          </Button>
        </DrawerClose>
        {props.children}
      </DrawerFooter>
    );
  };

  createNameForHOC("withVerticalDrawer", WrappedContent, VerticalDrawer);
  return VerticalDrawer;
}
