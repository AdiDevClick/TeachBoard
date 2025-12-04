import { DEV_MODE, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import { degreeCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { UseDegreeCreationProps } from "@/hooks/types/use-degree-creation.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { startTransition, useEffect, useRef } from "react";

const defaultOptions = {
  pageId: "none",
  inputControllers: degreeCreationInputControllers,
} satisfies UseDegreeCreationProps["hookOptions"];

/**
 * Hook for handling degree creation logic.
 *
 * @param queryHooks - The query hooks for handling form submission and state.
 * @param form - The resettable form instance.
 * @param hookOptions - Additional options for the hook.
 */
export function useDegreeCreation({
  queryHooks,
  form,
  hookOptions = defaultOptions,
}: UseDegreeCreationProps) {
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
    const options = dialogOptions(hookOptions.pageId);
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

      startTransition(() => {
        closeDialog(null, hookOptions.pageId);
      });
    }
  }, [isLoaded, error, data, form]);

  return { handleSubmit, setRef, observedRefs };
}
