import type {
  ArrayPath,
  FieldArray,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

/**
 * @description Props for the withDynamicFieldArray HOC, which provides functionality for managing dynamic field arrays in forms.
 */
export type WithDynamicFieldArrayProps<
  TField extends FieldValues = FieldValues,
> = {
  /** The returned form instance */
  form: UseFormReturn<TField>;
  /** A label for the add button */
  addButtonLabel?: string;
  /** The description for the fields array */
  description?: string;
  /** The legend/label/title for the fields array */
  title?: string;
  /**
   * The form field name for the dynamic array -
   * It MUST be a field array in the form schema
   * 
   * @example 
   * ```ts 
   * const formSchema = z.object({
      emails: z
        .array(
          z.object({
            address: z.string().email("Enter a valid email address."), // <-- "address" can be used as the key for each item in the array
          })
        )
        .min(1, "Add at least one email address.")
        .max(5, "You can add up to 5 email addresses."),
    })
    ```
   */
  initialItem: FieldArray<TField, ArrayPath<TField>>;
  /** The maximum number of items allowed in the array */
  maxItems?: number;
  /** The form field name for the dynamic array -
   * @example 
   * ```ts 
   * const formSchema = z.object({
   *    emails: z // <- "emails" is the name of the field array in the form schema, and should be passed as the "name" prop to the HOC
   *     .array(
   *        z.object({
   *        address: z.string().email("Enter a valid email address."),
          })
        )
        .min(1, "Add at least one email address.")
        .max(5, "You can add up to 5 email addresses."),
    })
    *```
    */
  name: ArrayPath<TField>;
};
