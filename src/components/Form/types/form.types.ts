import type { SimpleAvatarListProps } from "@/components/Avatar/types/avatar.types.ts";
import { SimpleAddButtonWithToolTip } from "@/components/Buttons/SimpleAddButton.tsx";
import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";
import type { ComponentProps } from "react";

/** Props for AvatarListWithLabelAndAddButton component */
export type AvatarListWithLabelAndAddButtonProps = {
  label?: string;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
    rest: Omit<ComponentProps<typeof SimpleAddButtonWithToolTip>, "onClick">
  ) => void;
  className?: string;
} & SimpleAvatarListProps &
  SimpleAddButtonWithToolTipProps;
