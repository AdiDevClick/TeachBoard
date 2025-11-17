import type { CardHeader } from "@/components/ui/card.tsx";
import type { ComponentProps } from "react";

/** Props for the ModalTitle component */
export type HeaderTitleProps = ComponentProps<typeof CardHeader> & {
  className?: string;
  /** Title text to render in the header */
  title?: string;
  /** Description text to render below the title */
  description?: string;
};
