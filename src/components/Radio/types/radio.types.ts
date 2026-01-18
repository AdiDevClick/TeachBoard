import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { RadioGroup } from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";

/**
 * Validation requirements for RadioItem.
 */
export type EvaluationRadioItemProps = {
  id: UUID;
  name: string;
  subSkills: Map<string, unknown>;
  description?: string;
} & ComponentProps<typeof RadioGroup>;
