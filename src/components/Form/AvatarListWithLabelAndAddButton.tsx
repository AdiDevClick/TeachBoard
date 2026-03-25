import { SimpleAvatarList } from "@/components/Avatar/SimpleAvatar.tsx";
import { SimpleAddButtonWithToolTip } from "@/components/Buttons/exports/buttons.exports";
import type { AvatarListWithLabelAndAddButtonProps } from "@/components/Form/types/form.types.ts";
import { Label } from "@/components/ui/label.tsx";
import {
  avatarListWithLabelAndAddButtonPropsInvalid,
  debugLogs,
} from "@/configs/app-components.config";
import { cn, preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import type { MouseEvent } from "react";

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
  props: AvatarListWithLabelAndAddButtonProps,
) {
  if (avatarListWithLabelAndAddButtonPropsInvalid(props)) {
    debugLogs("AvatarListWithLabelAndAddButton", {
      type: "propsValidation",
      props,
    });
  }

  const { items, label, className, onClick: externalOnClick, ...rest } = props;

  /**
   * Handle click event for the button.
   *
   * @description Adds other data to the event handler if needed.
   */
  const handleLocalClick = (e: MouseEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);

    if (externalOnClick) {
      externalOnClick({ e, ...rest });
    }
  };

  return (
    <div className={cn(className, "grid gap-2")}>
      <Label>{label ?? "No label"}</Label>
      <SimpleAvatarList items={items} />
      <SimpleAddButtonWithToolTip {...rest} onClick={handleLocalClick} />
    </div>
  );
}
