import type { CardHeader } from "@/components/ui/card.tsx";
import type { ComponentProps } from "react";

/** Props for the ModalTitle component */
export type HeaderTitleProps = ComponentProps<typeof CardHeader> & {
  className?: string;
};
