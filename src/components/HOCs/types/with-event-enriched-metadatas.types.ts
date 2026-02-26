import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types.ts";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types";
import type { FieldTypes } from "@/types/MainTypes";
import type { MouseEvent } from "react";
import type { FieldValues } from "react-hook-form";

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
export type withEventEnrichedMetadatasProps = Partial<FieldTypes<FieldValues>> &
  UseMutationObserverReturn &
  Partial<CommandHandlerFieldMeta> &
  Partial<{
    onChange: (e: unknown, meta?: CommandHandlerFieldMeta) => void;
    onValueChange: (value: unknown, meta?: CommandHandlerFieldMeta) => void;
    onOpenChange: (open: boolean, meta?: CommandHandlerFieldMeta) => void;
    onClick: (
      meta: CommandHandlerFieldMeta & { e: MouseEvent<HTMLButtonElement> },
    ) => void;
    /**
     * Meta object computed by the controller HOC. Components may choose to
     * ignore it or use it instead of computing their own local metadata.
     */
    controllerFieldMeta: CommandHandlerFieldMeta;
  }>;
