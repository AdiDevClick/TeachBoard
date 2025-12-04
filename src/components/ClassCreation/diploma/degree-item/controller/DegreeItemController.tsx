import type { DegreeItemProps } from "@/components/ClassCreation/diploma/degree-item/types/degree-item.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { DEV_MODE, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import { degreeCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { useEffect, useRef } from "react";

/**
 * Controller component for creating a new degree item.
 *
 * !! IMPORTANT !! Be sure that the inputControllers passed to this component are already validated by Zod Schema.
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param form - The react-hook-form instance.
 * @param className - Additional CSS classes for styling.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param queryHooks - The query hooks for handling form submission and state.
 */
export function DegreeItemController({
  pageId = "new-degree-item",
  inputControllers = degreeCreationInputControllers,
  className = "grid gap-4",
  formId,
  form,
  queryHooks,
}: Readonly<DegreeItemProps>) {
  const { closeDialog, dialogOptions } = useDialog();
  const { setRef, observedRefs } = useMutationObserver({});
  const { setQueryParams, onSubmit, data, error, isLoading, isLoaded } =
    queryHooks;
  const hasStartedCreation = useRef(false);

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    if (isLoading || hasStartedCreation.current) return;
    hasStartedCreation.current = true;
    const options = dialogOptions("new-degree-item-dialog");
    const endPoint =
      options?.apiEndpoint.split("/")[1]?.toUpperCase() || "LEVEL";
    setQueryParams({ endPoint, cachedFetchKey: options.queryKey });
    onSubmit(variables);
  };

  /**
   * Handle form results
   *
   * @description Close dialog on success and reset form
   */
  useEffect(() => {
    if (isLoaded && !error) {
      form.reset();
    }

    if (data) {
      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("NewDegreeItem created:", data);
      }
      hasStartedCreation.current = false;
      closeDialog(null, "new-degree-item-dialog");
    }
  }, [isLoaded, error, data, form]);

  const id = formId ?? pageId + "-form";

  return (
    <form
      id={id}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={inputControllers}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
      />
    </form>
  );
}
