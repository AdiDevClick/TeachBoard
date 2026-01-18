import type { ClassModules } from "@/api/store/types/steps-creation-store.types.ts";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { Item } from "@/components/ui/item.tsx";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Validation requirements for RadioItem.
 */
export type EvaluationRadioItemProps = {
  id: UUID;
  name: string;
  subSkills: ClassModules["subSkills"];
  description?: string;
  itemClick?: (
    e: MouseEvent<HTMLDivElement>,
    props: EvaluationRadioItemProps,
  ) => void;
} & ComponentProps<typeof Item>;
