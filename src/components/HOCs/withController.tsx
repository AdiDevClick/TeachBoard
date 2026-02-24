import type { WrapperPropsAny } from "@/components/Controller/types/controller.types.ts";
import { Field, FieldError } from "@/components/ui/field.tsx";
import {
  controllerPropsInvalid,
  debugLogs,
} from "@/configs/app-components.config.ts";
import type { ComponentPropsOf } from "@/utils/types/types.utils.ts";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";
import { Controller } from "react-hook-form";

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
 *   form={form}
 *   fullWidth={true}
 *   placeholder="Select school year"
 *   label="School Year"
 * />
 * ```
 */
function withController<C extends ComponentType<any>>(Wrapped: C) {
  function Component(props: WrapperPropsAny<C>) {
    if (controllerPropsInvalid(props)) {
      debugLogs("withController");
      return null;
    }
    const { name, form, defaultValue, ...restProps } = props;

    return (
      <Controller
        name={name}
        control={form.control}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
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
            <Wrapped
              {...({
                ...restProps,
                field,
                fieldState,
                controllerMeta: {
                  controllerName: name,
                },
              } as ComponentPropsOf<C>)}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
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
