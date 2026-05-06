import type { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

/**
 * Props for the EvaluationDetailDrawerButton component.
 */
export type EvaluationDetailDrawerButtonProps = Readonly<{
  label: string;
  getLink: (id: number | string) => string;
  url?: string;
}> &
  ComponentProps<typeof Button>;
