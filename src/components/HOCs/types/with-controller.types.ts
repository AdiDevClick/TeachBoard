/**
 * Props that the HOC itself requires or injects; these are NOT part of the
 * wrapped component's own API.
 */
// The value generic is intentionally `any` rather than
// `FieldValues` so callers may pass a `UseFormReturn`/`Control` bound to a
// specific schema without running into variance issues.  `any` makes the
// prop effectively untyped from the HOC's perspective while still allowing

import type { WithEventEnrichedMetadatasEvents } from "@/components/HOCs/types/with-event-enriched-metadatas.types";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types";
import type { RemoveStringIndex } from "@/utils/types/types.utils";
import type { Control } from "react-hook-form";

// the wrapped component to declare its own stricter fields if needed.
export type WithControllerInjectedProps = {
  /**
   * Alternatively you can pass the control directly. At least one of `form`
   * or `control` must be provided (the runtime helper will log a debug error
   * if neither is present).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic HOC accepts any schema-specific control instance
  control: Control<any> | undefined;
  /** The name of the field to be controlled. */
  name: string;

  /**
   * Allows passing a default value to the underlying `Controller` component.
   */
  defaultValue?: unknown;
} & WithEventEnrichedMetadatasEvents &
  UseMutationObserverReturn;

/**
 * Props accepted by a controlled component.
 */

export type WithControllerProps<P extends object> = Omit<
  RemoveStringIndex<P>,
  keyof WithEventEnrichedMetadatasEvents
> &
  WithControllerInjectedProps;
