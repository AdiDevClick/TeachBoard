import type { WithControllerProps } from "@/components/HOCs/types/with-controller.types";
import { Field, FieldError } from "@/components/ui/field.tsx";
import {
  controllerPropsInvalid,
  debugLogs,
} from "@/configs/app-components.config.ts";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";
import { Controller, type ControllerRenderProps } from "react-hook-form";

/**
 * Wrap a component with react-hook-form Controller.
 *
 * @param Wrapped - The component to be wrapped with the Controller.
 * 
 * @example
 * ```tsx
 * const VerticalFieldSelectWithController =
   withController(VerticalFieldSelect);
 *
 * <VerticalFieldSelectWithController
 *   name="schoolYear"
 *   control={control}
 *   defaultValue="2025-2026"
 *   fullWidth={true}
 *   placeholder="Select school year"
 *   label="School Year"
 * />
 * ```
 */

function withController<P extends object>(Wrapped: ComponentType<P>) {
  function Component(props: WithControllerProps<P>) {
    if (controllerPropsInvalid(props)) {
      debugLogs("withController", { type: "propsValidation", props });
      return null;
    }

    const { name, control, defaultValue, ...restProps } = props;

    /**
     * Manage change events for the controlled component, ensuring that both the react-hook-form state and any additional onChange handlers are called appropriately.
     */

    const makeHandleChange =
      (field: ControllerRenderProps) =>
      (...args: Parameters<ControllerRenderProps["onChange"]>) => {
        const a0 = args[0];
        const a1 = args[1];
        field.onChange(...args);
        props.onChange?.(a0, a1);
        props.onValueChange?.(a0, a1);
      };

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => {
          const wrappedProps = {
            ...restProps,
            ...field,
            fieldState,
            controllerMeta: { controllerName: name },
            onChange: makeHandleChange(field),
            onValueChange: makeHandleChange(field),
            "aria-invalid": fieldState.invalid,
          };

          return (
            <Field
              ref={(el) => {
                props.setRef?.(el, {
                  type: "controller",
                  name: name,
                  id: `field-${name}`,
                });
              }}
              data-invalid={fieldState.invalid}
            >
              <Wrapped {...(wrappedProps as P)} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          );
        }}
      />
    );
  }
  createNameForHOC("withController", Wrapped, Component);
  return Component;
}

/**
 * HOC to wrap a component with react-hook-form Controller.
 *
 */
export default withController;
