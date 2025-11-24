import type { InputsProps } from "@/components/Inputs/types/InputsTypes.ts";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Activity, useId } from "react";
import { Controller, type FieldValues } from "react-hook-form";

/**
 * Inputs component for rendering a list of input fields.
 *
 * @param items - Array of input controller objects.
 * @param form - React Hook Form instance for managing form state.
 */
export function Inputs<T extends FieldValues>({
  ref,
  items,
  form,
  ...props
}: Readonly<InputsProps<T>>) {
  const ids = useId();
  return (
    <ListMapper items={items}>
      {({ name, title, type, placeholder, autoComplete }) => (
        <Controller
          key={`${ids}-${title}`}
          name={name}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field ref={ref} {...props} data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={name}>{title}</FieldLabel>
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={fieldState.invalid}
                required
                value={field.value ?? ""}
              />
              <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                <FieldError errors={[fieldState.error]} />
              </Activity>
            </Field>
          )}
        />
      )}
    </ListMapper>
  );
}
