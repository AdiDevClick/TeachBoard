import type { WrapperProps } from "@/components/Controller/types/controller.types.ts";
import { Field, FieldError } from "@/components/ui/field.tsx";
import type {
  AnyComponentLike,
  ComponentPropsOf,
} from "@/utils/types/types.utils.ts";
import { Controller, type FieldValues } from "react-hook-form";

/**
 * ControlledInputs component for rendering a list of input fields.
 *
 * @param items - Array of input controller objects.
 * @param form - React Hook Form instance for managing form state.
 */
// export function AppController<T extends FieldValues>({
//   ref,
//   name,
//   form,
//   ...props
// }: Readonly<AppController<T>>) {
//   return (
//     <Controller
//       name={name}
//       control={form.control}
//       render={({ field, fieldState }) => (
//         <Field ref={ref} {...props} data-invalid={fieldState.invalid}>
//           {props.children}
//           <FieldError errors={[fieldState.error]} />
//         </Field>
//       )}
//     />
//   );
// }

/**
 * Wrap a component with react-hook-form Controller.
 *
 * @param Wrapped - The component to be wrapped with the Controller.
 */
function withController<C extends AnyComponentLike>(Wrapped: C) {
  return function Component<T extends FieldValues>(props: WrapperProps<T, C>) {
    const { ref, name, form, ...restProps } = props;

    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field ref={ref} data-invalid={fieldState.invalid}>
            <Wrapped
              {...(restProps as ComponentPropsOf<AnyComponentLike>)}
              {...field}
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
