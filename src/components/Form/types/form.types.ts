import type { SimpleAvatarListProps } from "@/components/Avatar/types/avatar.types.ts";
import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";

/** Props for AvatarListWithLabelAndAddButton component */
export type AvatarListWithLabelAndAddButtonProps = Omit<
  SimpleAvatarListProps & SimpleAddButtonWithToolTipProps,
  "onClick"
> & {
  label?: string;
  className?: string;
  /** Allow either the custom payload handler or a native mouse handler */
  onClick?: SimpleAddButtonWithToolTipProps["onClick"];
};
