import type { ViewCardContextType } from "@/api/contexts/types/context.types.ts";
import type { ComponentPropsWithoutRef, PropsWithChildren, Ref } from "react";

type BaseCardProps = {
  /** Optional ID for the card component */
  id?: string;
  /**  page ID for the card component */
  pageId: string;
  /** Ref to be forwarded to the Card component */
  ref?: Ref<HTMLDivElement>;
  /** Additional props for the Card component and CardContent component */
  card?: ViewCardContextType;
  /** Whether the card is rendered in modal mode */
  modalMode: boolean;
  /** Optional additional props for the Card component */
  cardRender?: ComponentPropsWithoutRef<"div">;
} & PropsWithChildren;

export type WithTitledCardProps<C extends object> = BaseCardProps & C;
