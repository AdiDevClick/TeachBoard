import { DropdownLayoutProvider } from "@/api/providers/DropdownMenuLayout.provider";
import type {
  DropdownLayoutProps,
  MenuContent,
  MenuTrigger,
} from "@/components/HOCs/types/with-dropdown-layout.types";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDropdownMenuLayoutContext } from "@/hooks/contexts/useDropdownMenuLayoutContext";
import { createNameForHOC } from "@/utils/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { type ComponentType } from "react";

/**
 * Higher-Order Component to wrap a component with a Dropdown Menu layout.
 */
export function withDropdownLayout<C extends object>(
  WrappedComponent: ComponentType<C>,
) {
  const Component = (props: DropdownLayoutProps<C>) => {
    const { menu, children, ...rest } = props;
    const contextValue = {
      rest,
      trigger: menu?.trigger,
      content: menu?.content,
    };

    return (
      <DropdownLayoutProvider value={contextValue}>
        <DropdownMenu {...menu}>{children}</DropdownMenu>
      </DropdownLayoutProvider>
    );
  };

  Component.Trigger = function Trigger(props: MenuTrigger) {
    const { trigger = {} } = useDropdownMenuLayoutContext();
    const triggerProps = { ...trigger, ...props };

    return (
      <DropdownMenuTrigger asChild {...triggerProps}>
        {props.children}
      </DropdownMenuTrigger>
    );
  };

  Component.Content = function Content(props: MenuContent) {
    const { content = {}, rest } = useDropdownMenuLayoutContext();
    const contentProps = { ...content, ...props };

    return (
      <DropdownMenuContent align="end" {...contentProps}>
        <WrappedComponent {...rest} />
        {props.children}
      </DropdownMenuContent>
    );
  };

  createNameForHOC("withDropdownLayout", WrappedComponent, Component);

  return Component;
}
