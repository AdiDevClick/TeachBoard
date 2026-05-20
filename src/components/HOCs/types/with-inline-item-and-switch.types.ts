import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { MouseEvent, SetStateAction } from "react";

export type InlineItemAndSwitchSelectionPayload = {
  id?: UUID | string;
  title: string;
  isSelected: boolean;
  index?: string | number;
  setIsSelected: (selected: SetStateAction<boolean>) => void;
  /** Styles for the container */
  className?: string;
};

/**
 * Expected props for withInlineItemAndSwitchSelection HOC.
 */
export type InlineItemAndSwitchSelectionProps = Omit<
  InlineItemAndSwitchSelectionPayload,
  "setIsSelected"
> & {
  value?: boolean;
  onChange?: (
    selected: boolean,
    payload: InlineItemAndSwitchSelectionPayload,
  ) => void;
  onSwitchClick?: (
    e: MouseEvent<HTMLButtonElement>,
    payload: InlineItemAndSwitchSelectionPayload,
  ) => void;
};
