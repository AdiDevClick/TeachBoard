import type { withEventEnrichedMetadatasProps } from "@/components/HOCs/types/with-event-enriched-metadatas.types";
import {
  debugLogs,
  withEventEnrichedMetadatasContainsInvalid,
} from "@/configs/app-components.config";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import { createNameForHOC } from "@/utils/utils";
import { useMemo, type ComponentType, type MouseEvent } from "react";

/**
 * Higher-order component to pre-configure some components to be ready for use with react-hook-form Controller.
 *
 * @param WrapperComponent - The component to wrap with Controller integration.
 * @param field - The field props from react-hook-form Controller.
 * @param fieldState - The field state from react-hook-form Controller.
 * @param props - Other props to pass to the wrapped component.
 *
 * @returns A new component that is pre-configured for use with react-hook-form Controller.
 */
export function withEventEnrichedMetadatas<P extends object>(
  WrapperComponent: ComponentType<P>,
) {
  function Component(props: P & withEventEnrichedMetadatasProps) {
    if (withEventEnrichedMetadatasContainsInvalid(props)) {
      debugLogs("[withEventEnrichedMetadatas]");
    }

    const {
      setRef,
      task,
      apiEndpoint,
      dataReshapeFn,
      onOpenChange: userOnOpenChange,
      onChange: userOnChange,
      onValueChange: userOnValueChange,
      onClick: userOnClick,
      ...rest
    } = props;

    /**
     * Memoize meta data to avoid unnecessary re-renders of PopoverFieldProvider and its consumers when unrelated props change.
     *
     * @description This is used to enrich the each selection.
     */
    const controllerFieldMeta = useMemo<CommandHandlerFieldMeta>(
      () => ({
        task: task ?? "none",
        apiEndpoint,
        dataReshapeFn,
        name: props.name,
        id: props.id,
      }),
      [task, apiEndpoint, dataReshapeFn, props.name, props.id],
    );

    const handleChange = (e: unknown) => {
      userOnChange?.(e, controllerFieldMeta);
    };

    const handleOnOpenChange = (isOpen: boolean) => {
      userOnOpenChange?.(isOpen, controllerFieldMeta);
    };

    const handleOnValueChange = (value: unknown) => {
      userOnValueChange?.(value, controllerFieldMeta);
    };

    const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
      userOnClick?.({
        ...controllerFieldMeta,
        e,
      });
    };

    return (
      <WrapperComponent
        {...(rest as P)}
        setRef={(el: HTMLElement) => {
          setRef?.(el, controllerFieldMeta);
        }}
        controllerFieldMeta={controllerFieldMeta}
        onChange={handleChange}
        onOpenChange={handleOnOpenChange}
        onValueChange={handleOnValueChange}
        onClick={handleOnClick}
      />
    );
  }

  createNameForHOC("withEventEnrichedMetadatas", WrapperComponent, Component);
  return Component;
}
