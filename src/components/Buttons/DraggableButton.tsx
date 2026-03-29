import type { CommonTooltipButtonProps } from "@/components/Buttons/types/ButtonTypes";
import { withToolTip } from "@/components/HOCs/withToolTip";
import { Button } from "@/components/ui/button";
import { IconGripVertical } from "@tabler/icons-react";
import type { ComponentProps } from "react";

export type VerticalDotButtonProps = {
  accessibilityLabel: string;
  toolTipText?: string;
} & ComponentProps<typeof Button>;

/**
 * A commonly used button component that displays a vertical dots icon, often used to indicate a menu or more options.
 *
 * @description It is wrapped with a tooltip that shows additional information when hovered over.
 *
 * @param accessibilityLabel - A string that provides an accessible label for the button, used by screen readers.
 * @param toolTipText - An optional string that specifies the text to be displayed in the tooltip when the user hovers over the button. If not provided, the tooltip will not be shown.
 * @param props - Additional props that can be passed to the underlying Button component
 */
export function DraggableButton({
  accessibilityLabel,
  toolTipText,
  ...props
}: CommonTooltipButtonProps) {
  return (
    <ButtonWithTooltip
      toolTipText={toolTipText ?? ""}
      variant="ghost"
      className="size-7 text-muted-foreground  hover:bg-neutral-300/50"
      size="icon"
      {...props}
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">{accessibilityLabel}</span>
    </ButtonWithTooltip>
  );
}
const ButtonWithTooltip = withToolTip(Button);
