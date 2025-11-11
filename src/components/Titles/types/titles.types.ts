import type { CardHeader } from "@/components/ui/card.tsx";
import type { ComponentProps } from "react";

/** Props for the ModalTitle component */
export type ModalTitleProps = ComponentProps<typeof CardHeader> & {
  className?: string;
};
