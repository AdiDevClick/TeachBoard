import type { CardHeader } from "@/components/ui/card.tsx";
import type { ComponentProps, ReactNode } from "react";

/** Props for the ModalTitle component */
export type HeaderTitleProps = ComponentProps<typeof CardHeader> & {
  /** Unique identifier for the header */
  id?: string;
  /** Additional class names for styling */
  className?: string;
  /** Title text to render in the header */
  title?: string;
  /** Description text to render below the title */
  description?: ReactNode;
};
