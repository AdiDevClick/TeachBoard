import { ButtonWithTooltip } from "@/components/Buttons/exports/buttons.exports";
import type { PaginationButtonProps } from "@/components/Buttons/types/ButtonTypes";

/**
 * A button component designed for pagination controls, enhanced with a tooltip for better user experience.
 *
 * @param label - The label for the pagination button, used for tooltips and accessibility.
 * @param props - Additional props to be passed to the underlying Button component.
 */
export function PaginationButton({
  label,
  icon,
  ...props
}: PaginationButtonProps) {
  const Icon = icon;

  return (
    <ButtonWithTooltip
      {...props}
      toolTipText={label}
      variant="outline"
      size="icon"
      className="size-8"
    >
      <span className="sr-only">{label}</span>
      <Icon />
    </ButtonWithTooltip>
  );
}
