import { SimpleAvatarList } from "@/components/Avatar/SimpleAvatar.tsx";
import { SimpleAddButtonWithToolTip } from "@/components/Buttons/SimpleAddButton.tsx";
import type { AvatarListWithLabelAndAddButtonProps } from "@/components/Form/types/form.types.ts";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import { Label } from "@/components/ui/label.tsx";
import { cn } from "@/utils/utils.ts";

/**
 * Avatar list component with a label and an add button.
 *
 * @param label - Label for the avatar list
 * @param items - List of avatar items
 * @param toolTipText - Tooltip text for the add button
 * @param onClick - Click handler for the add button
 * @param className - Additional class names for styling
 *
 * @returns
 */
export function AvatarListWithLabelAndAddButton(
  props: AvatarListWithLabelAndAddButtonProps
) {
  const { items, toolTipText, onClick, label, className, ...rest } = props;
  return (
    <div className={cn(className, "grid gap-2")}>
      <Label>{label ?? "No label"}</Label>
      <SimpleAvatarList items={items} />
      <SimpleAddButtonWithToolTip
        {...rest}
        toolTipText={toolTipText ?? "No tooltip text"}
        onClick={onClick}
      />
    </div>
  );
}

export const AvatarsWithLabelAndAddButtonList = withListMapper(
  AvatarListWithLabelAndAddButton
);
