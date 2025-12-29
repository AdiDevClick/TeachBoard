import { InertSelectItem } from "@/components/Selects/inert-on-click/InertSelectItem";
import type { ButtonItemWithIconProps } from "@/components/Selects/types/select.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * HOC to create a Button with an icon.
 *
 * @param inertIconText - The text to display for the Button's text.
 * @param Wrapped - The component to be wrapped.
 * @param props - Props for the wrapped component.
 * @return A new component that renders the Wrapped component with an icon Button.
 */
function withIconItem<P extends object>(Wrapped: ComponentType<P>) {
  return function Component(props: P & ButtonItemWithIconProps) {
    const { inertIconText, children, ...rest } = props;
    return (
      <Wrapped {...(rest as P)}>
        {children}
        <span className="loneText">{inertIconText}</span>
        <Button variant="ghost" size="icon" className="rounded-full max-h-2">
          <PlusIcon />
        </Button>
      </Wrapped>
    );
  };
}
export const InertSelectItemWithIcon = withIconItem(InertSelectItem);
