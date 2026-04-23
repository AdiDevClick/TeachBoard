import type { WithDynamicFieldArrayProps } from "@/components/HOCs/types/with-dynamic-field-array.types";
import withController from "@/components/HOCs/withController";
import withListMapper from "@/components/HOCs/withListMapper";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";
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
export function withDynamicFieldArray<C extends object>(
  WrappedComponent: ComponentType<C>,
) {
  // A list of controlled components from the wrapped
  const WrappedComponentList = withListMapper(withController(WrappedComponent));

  function Component(props: C & WithDynamicFieldArrayProps) {
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
      control: form.control,
      name: fieldName,
      arrayLength: fields.length,
      remove,
    };

    return (
      <FieldSet>
        <FieldLegend variant="label">{title}</FieldLegend>
        <FieldDescription>{description}</FieldDescription>
        <FieldGroup>
          <WrappedComponentList
            {...(componentProps as C)}
            items={fields}
            optional={(_field, index) => ({
              name: `${fieldName}.${index}`,
            })}
          />

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
