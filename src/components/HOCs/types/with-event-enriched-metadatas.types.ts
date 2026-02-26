import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types.ts";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types";
import type { FieldTypes } from "@/types/MainTypes";
import type { MouseEvent } from "react";
import type { FieldValues } from "react-hook-form";

export type OnClickWithMeta = (
  meta: CommandHandlerFieldMeta & { e: MouseEvent<HTMLButtonElement> },
) => void;

export type OnOpenChangeWithMeta = (
  isOpen: boolean,
  meta: CommandHandlerFieldMeta,
) => void;

export type OnValueChangeWithMeta = (
  value: unknown,
  meta: CommandHandlerFieldMeta,
) => void;

export type OnChangeWithMeta = (
  e: unknown,
  meta: CommandHandlerFieldMeta,
) => void;
/**
 * Props type for components wrapped with `withController`.  This includes the props of the wrapped component
 */
// `withEventEnrichedMetadatas` is intended to be harmless when a field is rendered
// outside of a react-hook-form `Controller`.  At runtime the HOC already
// checks for the presence of `field`/`fieldState` and continues rendering even
// when they are missing, merely logging a debug message.  The previous
// version of this type made those props required, which led to numerous
// compiler errors after we started wrapping components unconditionally.  To
// match the runtime behaviour we now make the props optional.
export type WithEventEnrichedMetadatasProps = Partial<FieldTypes<FieldValues>> &
  UseMutationObserverReturn &
  Partial<CommandHandlerFieldMeta> &
  Partial<{
    onChange: OnChangeWithMeta;
    onValueChange: OnValueChangeWithMeta;
    onOpenChange: OnOpenChangeWithMeta;
    onClick: OnClickWithMeta;
    /**
     * Meta object computed by the controller HOC. Components may choose to
     * ignore it or use it instead of computing their own local metadata.
     */
    controllerFieldMeta: CommandHandlerFieldMeta;
  }>;
