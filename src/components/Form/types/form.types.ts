import type { SimpleAvatarListProps } from "@/components/Avatar/types/avatar.types.ts";
import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";

/** Props for AvatarListWithLabelAndAddButton component */
export type AvatarListWithLabelAndAddButtonProps = SimpleAvatarListProps & {
  label?: string;
} & SimpleAddButtonWithToolTipProps;
