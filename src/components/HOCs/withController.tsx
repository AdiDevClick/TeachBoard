import type { WrapperProps } from "@/components/Controller/types/controller.types.ts";
import { Field, FieldError } from "@/components/ui/field.tsx";
import {
  controllerPropsInvalid,
  debugLogs,
} from "@/configs/app-components.config.ts";
import type { AnyComponentLike } from "@/utils/types/types.utils.ts";
import { type ComponentProps } from "react";
import { Controller, type FieldValues } from "react-hook-form";

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
function withController<C extends AnyComponentLike>(Wrapped: C) {
  return function Component<T extends FieldValues>(props: WrapperProps<T, C>) {
    if (controllerPropsInvalid(props)) {
      debugLogs("withController");
      return null;
    }

    const { name, form, ...restProps } = props;

    return (
      <Controller
        name={name}
        control={form.control}
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
              } as ComponentProps<C>)}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    );
  };
}

/**
 * HOC to wrap a component with react-hook-form Controller.
 *
 */
export default withController;
