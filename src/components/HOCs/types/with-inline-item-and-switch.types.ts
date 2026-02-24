import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { MouseEvent, SetStateAction } from "react";

export type InlineItemAndSwitchSelectionPayload = {
  id: UUID | string;
  title: string;
  isSelected: boolean;
  index: string | number;
  setIsSelected: (selected: SetStateAction<boolean>) => void;
};

/**
 * Expected props for withInlineItemAndSwitchSelection HOC.
 */
export type InlineItemAndSwitchSelectionProps =
  InlineItemAndSwitchSelectionPayload & {
    onSwitchClick?: (
      e: MouseEvent<HTMLButtonElement>,
      payload: InlineItemAndSwitchSelectionPayload,
    ) => void;
  };
