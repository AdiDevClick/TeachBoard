import type { FormWithDebugProps } from "@/components/Form/types/form.types";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { DEV_MODE } from "@/configs/app.config";
import { cn } from "@/utils/utils";
import type { FieldValues } from "react-hook-form";
import { useFormState } from "react-hook-form";

/**
 * FormWithDebug component is a wrapper around a standard form that provides additional debugging information during development.
 *
 * @param formId - The ID of the form element.
 * @param form - The react-hook-form instance controlling the form state.
 * @param onValidSubmit - Callback function to handle form submission when the form is valid.
 * @param onInvalidSubmit - Callback function to handle form submission when the form is invalid.
 */
export function FormWithDebug<T extends FieldValues>(
  props: FormWithDebugProps<T>,
) {
  const { formId, form, className, onValidSubmit, onInvalidSubmit, children } =
    props;
  const { errors, isValid } = useFormState({ control: form.control });

  /**
   * VERIFICATION - Triggers the debug validation manually
   */
  const handleVerifyClick = async () => {
    const ok = await form.trigger();
    console.debug("[FormWithDebug] form.trigger =>", {
      ok,
      values: form.getValues(),
      errors,
    });
    return ok;
  };

  return (
    <form
      id={formId}
      className={className}
      onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
    >
      {DEV_MODE && !isValid && (
        <Item
          className={cn(
            "relative mb-4 px-4 py-2 border rounded bg-slate-50 text-slate-700 w-full flex flex-wrap gap-4",
            className,
          )}
        >
          <ItemContent>
            <ItemTitle>Validation errors (dev)</ItemTitle>
            <pre className="w-full whitespace-pre-wrap text-xs bg-white/0 p-2 rounded">
              {JSON.stringify(errors, null, 2)}
            </pre>
          </ItemContent>
          <ItemFooter className="w-full">
            <Button type="button" onClick={handleVerifyClick}>
              Verify validation now
            </Button>
          </ItemFooter>
        </Item>
      )}
      {children}
    </form>
  );
}
