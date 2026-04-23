import type {
  DynamicInjectedProps,
  WithDynamicFieldArrayProps,
} from "@/components/HOCs/types/with-dynamic-field-array.types";
import { ListMapper } from "@/components/Lists/ListMapper";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";
import type { FieldValues } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

/**
 * Higher-order component with dynamic field array functionality using react-hook-form's useFieldArray.
 *
 * @description With this HOC, you can add fields dynamically to a form.
 * It provides an "Add" button to append new fields and handles the rendering of the field array.
 *
 * @remark In order to use this HOC, the wrapped component must accept the following props:
 * - form: The react-hook-form instance managing the form state.
 * - name: The name of the field array in the form schema.
 * - Your component MUST use the Controller component from react-hook-form.
 */
export function withDynamicFieldArray<TExtra extends object>(
  WrappedComponent: ComponentType<
    DynamicInjectedProps & Omit<TExtra, keyof DynamicInjectedProps>
  >,
) {
  function Component<TField extends FieldValues = FieldValues>(
    props: Omit<TExtra, keyof DynamicInjectedProps> &
      WithDynamicFieldArrayProps<TField>,
  ) {
    const {
      form,
      name: fieldName,
      title = "Une légende pour le groupe de champs",
      description = "Une description pour le groupe de champs",
      addButtonLabel = "Ajouter une justification",
      maxItems = Number.MAX_SAFE_INTEGER,
      initialItem,
      ...restProps
    } = props;

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: fieldName,
    });

    const componentProps = {
      ...restProps,
      form,
      name: fieldName,
      arrayLength: fields.length,
      remove,
    };

    return (
      <FieldSet>
        <FieldLegend variant="label">{title}</FieldLegend>
        <FieldDescription>{description}</FieldDescription>
        <FieldGroup>
          <ListMapper items={fields}>
            {(_field, index) => (
              <WrappedComponent
                {...props}
                {...componentProps}
                index={index}
                name={`${fieldName}.${index}`}
              />
            )}
          </ListMapper>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append(initialItem)}
            disabled={fields.length >= maxItems}
          >
            {addButtonLabel}
          </Button>
        </FieldGroup>
      </FieldSet>
    );
  }

  createNameForHOC("withDynamicFieldArray", WrappedComponent, Component);

  return Component;
}
