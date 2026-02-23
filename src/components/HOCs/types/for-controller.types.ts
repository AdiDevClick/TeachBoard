import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types.ts";
import type { FieldTypes } from "@/types/MainTypes";
import type { ComponentType } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * Props type for components wrapped with `withController`.  This includes the props of the wrapped component
 */
export type ForControllerProps<P = ComponentType> = P &
  FieldTypes<FieldValues> &
  Partial<CommandHandlerFieldMeta> &
  Partial<{
    onChange: (e: unknown, meta?: CommandHandlerFieldMeta) => void;
    onValueChange: (value: unknown, meta?: CommandHandlerFieldMeta) => void;
    onOpenChange: (open: boolean, meta?: CommandHandlerFieldMeta) => void;
    /**
     * Meta object computed by the controller HOC. Components may choose to
     * ignore it or use it instead of computing their own local metadata.
     */
    controllerFieldMeta: CommandHandlerFieldMeta;
  }>;
