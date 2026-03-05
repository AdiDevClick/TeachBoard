import {
  debugLogs,
  isValidDebounceAvailabilityMeta,
} from "@/configs/app-components.config";
import type { lastErrorType } from "@/features/class-creation/components/main/hooks/types/use-debounced-checker.types";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import { useFetch } from "@/hooks/database/fetches/useFetch";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import useDebounce from "@/hooks/useDebounce";
import type { AppRouteResponseContract } from "@/types/AppResponseInterface";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { useEffect, useEffectEvent, useRef, type ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * Custom hook to manage debounced availability checks for input names during class creation, utilizing the useFetch hook for API calls and handling command input changes.
 *
 * @param delay - The debounce delay in milliseconds for the availability check API calls. Default is 500ms.
 * @returns An object containing the availability error (if any) and the debounced availability check function to be used in input change handlers.
 */
export function useDebouncedChecker<
  T extends AppRouteResponseContract<any, any> = AppRouteResponseContract<
    any,
    any
  >,
>(form: UseFormReturn<any>, delay: number = 500) {
  type Success = T extends AppRouteResponseContract<infer SS, any> ? SS : never;
  type Error = T extends AppRouteResponseContract<any, infer EE> ? EE : never;

  const { response, error, fetchParams, setFetchParams, onSubmit } = useFetch<
    Success,
    Error
  >();

  const lastErrorRef = useRef<lastErrorType>(null);

  /**
   * Trigger name availability check when the fetchParams.url changes, which happens after the debounced function sets new params.
   */
  const triggerCheck = useEffectEvent((url: string) => {
    if (!url) return;
    onSubmit();
  });

  /**
   * TRIGGER NAME AVAILABILITY CHECK
   *
   * @description Every time a user types in the class name input
   */
  useEffect(() => {
    triggerCheck(fetchParams.url);
  }, [fetchParams.url]);

  /**
   * Handle changes to the class name input, including debounced API calls to check for name availability.
   *
   * @param event - The change event from the class name input
   * @param meta - Optional metadata for the command handler, including API endpoint information
   */
  const availabilityCheck = useDebounce(
    (event: ChangeEvent<HTMLInputElement>, meta?: CommandHandlerFieldMeta) => {
      preventDefaultAndStopPropagation(event);
      const value = event.target.value.trim().toLowerCase();

      if (!isValidDebounceAvailabilityMeta(meta) || value.length < 2) {
        debugLogs("useDebouncedChecker", meta);
        return;
      }

      const { name, task, searchParams, dataReshapeFn, apiEndpoint } = meta;

      const fieldState = form.getFieldState(name);
      const lastError = lastErrorRef.current;

      const { errorValue, errorKey, error } = lastError || {};

      if (errorValue === value) {
        if (!fieldState.error && error && errorKey === name) {
          form.setError(name, error);
        }
        return;
      }

      // Clear any existing error on the field when starting a new check
      if (fieldState.error) {
        form.clearErrors(name);
      }

      const computedApiEndpoint =
        typeof apiEndpoint === "function" ? apiEndpoint(value) : apiEndpoint;

      lastErrorRef.current = { ...lastErrorRef.current, value };

      setFetchParams((prev) => ({
        ...prev,
        url: String(computedApiEndpoint),
        method: "GET",
        contentId: task as FetchParams["contentId"],
        dataReshapeFn,
        searchParams,
        silent: true,
        onCacheVerify(cachedData: any) {
          if (cachedData?.available === false) {
            return Promise.reject({ data: cachedData });
          }
        },
      }));
    },
    delay,
  );

  /**
   * Effect to handle API response for class name availability check, setting form errors if the name is already taken.
   */
  useEffect(() => {
    const notIsAvailable = error?.data?.available === false;
    const fieldKey = fetchParams.searchParams?.by;

    if (notIsAvailable && fieldKey) {
      let fieldLabel = fieldKey;

      if (fieldLabel === "name") {
        fieldLabel = "nom";
      }

      const manualError = {
        type: "manual",
        message: `Ce ${fieldLabel} est déjà utilisé. Veuillez en choisir un autre.`,
      };

      lastErrorRef.current = {
        errorValue: lastErrorRef.current?.value,
        errorKey: fieldKey,
        error: manualError,
      };
      form.setError(fieldKey, manualError);
    }
  }, [response, error, form, fetchParams.searchParams?.by]);

  return {
    availabilityCheck,
    fetchParams,
  };
}
