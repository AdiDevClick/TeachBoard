import type { ForControllerProps } from "@/components/HOCs/types/for-controller.types";
import {
  debugLogs,
  forControllerContainsInvalid,
} from "@/configs/app-components.config";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import { createNameForHOC } from "@/utils/utils";
import { useMemo, type ComponentType } from "react";

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
export function forController<P>(WrapperComponent: ComponentType<P>) {
  function Component(props: ForControllerProps<P>) {
    const {
      field,
      fieldState,
      setRef,
      task,
      apiEndpoint,
      dataReshapeFn,
      name,
      id,
      onOpenChange: userOnOpenChange,
      onChange: userOnChange,
      onValueChange: userOnValueChange,
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
        name: name ?? field.name,
        id,
      }),
      [task, apiEndpoint, dataReshapeFn, name, id, field.name],
    );

    if (forControllerContainsInvalid(props)) {
      debugLogs("[forController]");
      return null;
    }

    const handleChange = (e: unknown) => {
      field.onChange(e);
      userOnChange?.(e, controllerFieldMeta);
    };

    const handleOnOpenChange = (
      isOpen: boolean,
      meta?: CommandHandlerFieldMeta,
    ) => {
      userOnOpenChange?.(isOpen, { ...controllerFieldMeta, ...meta });
    };

    const handleOnValueChange = (
      value: unknown,
      meta?: CommandHandlerFieldMeta,
    ) => {
      field.onChange(value);
      userOnValueChange?.(value, {
        ...controllerFieldMeta,
        ...meta,
      });
    };

    return (
      <WrapperComponent
        {...(rest as P)}
        {...field}
        id={id}
        setRef={(el: Element | null) => {
          setRef?.(el, controllerFieldMeta);
        }}
        controllerFieldMeta={controllerFieldMeta}
        value={field.value ?? ""}
        onChange={handleChange}
        onOpenChange={handleOnOpenChange}
        onValueChange={handleOnValueChange}
        aria-invalid={fieldState.invalid}
      />
    );
  }

  createNameForHOC("forController", WrapperComponent, Component);
  return Component;
}
