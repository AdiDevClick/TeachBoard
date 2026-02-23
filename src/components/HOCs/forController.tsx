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

    // when working with a controlled component we expose a unified "onValueChange"
    // callback regardless of the underlying DOM event.  This mirrors the behaviour
    // of `withController` and other custom components in the repo.
    const handleChange = (e: unknown) => {
      // the shape of the event varies depending on the wrapped component.  we
      // normalise it to something with an optional `target.value` field without
      // introducing `any`.
      field.onChange(e);
      userOnChange?.(e, controllerFieldMeta);
      const value = (e as { target?: { value?: unknown } })?.target?.value ?? e;
      userOnValueChange?.(value, controllerFieldMeta);
    };

    const handleOnOpenChange = (
      isOpen: boolean,
      meta?: CommandHandlerFieldMeta,
    ) => {
      userOnOpenChange?.(isOpen, meta ?? controllerFieldMeta);
    };

    return (
      <WrapperComponent
        {...(rest as P)}
        {...field}
        setRef={(el: Element | null) => {
          setRef?.(el, controllerFieldMeta);
        }}
        controllerFieldMeta={controllerFieldMeta}
        value={field.value ?? ""}
        onChange={handleChange}
        onOpenChange={handleOnOpenChange}
        aria-invalid={fieldState.invalid}
      />
    );
  }

  createNameForHOC("forController", WrapperComponent, Component);
  return Component;
}
