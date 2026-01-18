import type { ClassModules } from "@/api/store/types/steps-creation-store.types.ts";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { RadioGroup } from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";

/**
 * Validation requirements for RadioItem.
 */
export type EvaluationRadioItemProps = {
  id: UUID;
  name: string;
  subSkills: ClassModules["subSkills"];
  description?: string;
} & ComponentProps<typeof RadioGroup>;
