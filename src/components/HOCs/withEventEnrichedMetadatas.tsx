import type { WithEnrichedProps } from "@/components/HOCs/types/with-event-enriched-metadatas.types";
import {
  debugLogs,
  withEventEnrichedMetadatasContainsInvalid,
} from "@/configs/app-components.config";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import { createNameForHOC } from "@/utils/utils";
import {
  useMemo,
  type ChangeEvent,
  type ComponentType,
  type MouseEvent,
} from "react";

/**
 * Higher-order component to pre-configure some components to be ready for use with react-hook-form Controller.
 *
 * @param WrapperComponent - The component to wrap with Controller integration.Controller.Controller.
 * @param apiEndpoint - The API endpoint to be used for the command handler metadata enrichment.
 * @param dataReshapeFn - The function to reshape data before submission, to be used for the command handler metadata enrichment.
 * @param task - The task name to be used for the command handler metadata enrichment.
 * @param setRef - The ref setter function to be used for the command handler metadata enrichment.
 * @param name - The name of the field to be controlled, to be used for the command handler metadata enrichment.
 * @param id - The id of the field to be controlled, to be used for the command handler metadata enrichment.
 * @param onChange - The change event handler to be called with enriched metadata when the controlled component's value changes.
 * @param onOpenChange - The open change event handler to be called with enriched metadata when the controlled component's open state changes (e.g., for dropdowns).
 * @param onValueChange - The value change event handler to be called with enriched metadata when the controlled component's value changes (debounced).
 * @param onClick - The click event handler to be called with enriched metadata when the controlled component is clicked.
 *
 * @returns A new component that is pre-configured for use with react-hook-form Controller.
 */
export function withEventEnrichedMetadatas<P extends object>(
  WrapperComponent: ComponentType<P>,
) {
  function Component(props: WithEnrichedProps<P>) {
    if (withEventEnrichedMetadatasContainsInvalid(props)) {
      debugLogs("withEventEnrichedMetadatas", {
        type: "propsValidation",
        props,
      });
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    const wrapperProps = {
      ...rest,
      setRef: (el: HTMLElement) => {
        setRef?.(el, controllerFieldMeta);
      },
      controllerFieldMeta,
      onChange: handleChange,
      onOpenChange: handleOnOpenChange,
      onValueChange: handleOnValueChange,
      onClick: handleOnClick,
    };

    return <WrapperComponent {...(wrapperProps as P)} />;
  }

  createNameForHOC("withEventEnrichedMetadatas", WrapperComponent, Component);
  return Component;
}
