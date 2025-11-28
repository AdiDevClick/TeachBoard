import type { WrapperProps } from "@/components/Controller/types/controller.types.ts";
import { Field, FieldError } from "@/components/ui/field.tsx";
import type { AnyComponentLike } from "@/utils/types/types.utils.ts";
import type { ComponentProps } from "react";
import { Controller, type FieldValues } from "react-hook-form";

/**
 * Wrap a component with react-hook-form Controller.
 *
 * @param Wrapped - The component to be wrapped with the Controller.
 */
function withController<C extends AnyComponentLike>(Wrapped: C) {
  return function Component<T extends FieldValues>({
    ref,
    ...props
  }: WrapperProps<T, C>) {
    const typedProps = props as WrapperProps<T, C>;
    if (!typedProps?.form || !typedProps?.name) {
      return null;
    }
    const { name, form, ...restProps } = typedProps;
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field ref={ref} data-invalid={fieldState.invalid}>
            <Wrapped
              {...({
                ...restProps,
                field,
                fieldState,
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
 * @example
 * ```tsx
 * const VerticalFieldSelectWithController =
   WithController(VerticalFieldSelect);
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
export const WithController = withController;
