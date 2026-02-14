import {
  debugLogs,
  forControllerContainsInvalid,
} from "@/configs/app-components.config";
import type { FieldTypes } from "@/types/MainTypes";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";
import type { FieldValues } from "react-hook-form";

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
  function Component(props: P & FieldTypes<FieldValues>) {
    if (forControllerContainsInvalid(props)) {
      debugLogs("[forController]");
      return null;
    }

    const { field, fieldState, ...rest } = props;

    return (
      <WrapperComponent
        {...(rest as P)}
        {...field}
        value={field.value ?? ""}
        // onValueChange={handleValueChange}
        // name={field.name} // NOTE: name is already included in {...field}, but can be explicitly passed if needed by the popover component
        aria-invalid={fieldState.invalid}
      />
    );
  }

  return createNameForHOC("forController", WrapperComponent, Component);
}
