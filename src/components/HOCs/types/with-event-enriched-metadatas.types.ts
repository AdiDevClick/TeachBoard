import type {
  CommandHandlerFieldMeta,
  HandleAddNewItemParams,
} from "@/hooks/database/types/use-command-handler.types.ts";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types";
import type { ChangeEvent } from "react";

export type OnClickWithMeta = (params: HandleAddNewItemParams) => void;

export type OnOpenChangeWithMeta = (
  isOpen: boolean,
  meta: CommandHandlerFieldMeta,
) => void;

export type OnValueChangeWithMeta = (
  value: unknown,
  meta: CommandHandlerFieldMeta,
) => void;

export type OnChangeWithMeta = (
  e: ChangeEvent<HTMLInputElement>,
  meta: CommandHandlerFieldMeta,
) => void;

export type WithEventEnrichedMetadatasEvents = {
  /**
   * Change Event to be called with enriched metadata when the controlled component's value changes.
   */
  onChange?: OnChangeWithMeta;
  /**
   * Value Change Event to be called with enriched metadata when the controlled component's value changes (debounced).
   */
  onValueChange?: OnValueChangeWithMeta;
  /**
   * Open Change Event to be called with enriched metadata when the controlled component's open state changes (e.g., for dropdowns).
   */
  onOpenChange?: OnOpenChangeWithMeta;
  /**
   * Click Event to be called with enriched metadata when the controlled component is clicked.
   */
  onClick?: OnClickWithMeta;
};

/**
 * Props type for components wrapped with `withEventEnrichedMetadatas`.  This includes the props of the wrapped component
 */
export type WithEventEnrichedMetadatasProps = UseMutationObserverReturn &
  CommandHandlerFieldMeta &
  WithEventEnrichedMetadatasEvents;

/**
 * The props accepted by the component returned by `withEventEnrichedMetadatas`.  This includes the original props of the wrapped component (P) plus the enrichment props defined in `WithEventEnrichedMetadatasProps`.
 */
export type WithEnrichedProps<P extends object> =
  WithEventEnrichedMetadatasProps &
    Omit<P, keyof WithEventEnrichedMetadatasProps>;
