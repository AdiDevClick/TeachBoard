import { useAppStore } from "@/api/store/AppStore";
import { useSidebar } from "@/components/ui/sidebar";
import { HTTP_METHODS } from "@/configs/app.config";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { AppControllerInterface } from "@/types/AppControllerInterface";
import type { DataReshapeFn } from "@/types/AppInputControllerInterface";
import { wait } from "@/utils/utils";
import { startTransition, useEffect } from "react";
import type { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const toastId = "login-loading";
interface UseAppFormProps<T extends FieldValues = FieldValues> extends Pick<
  AppControllerInterface<T>,
  "form" | "pageId" | "submitRoute"
> {
  submitDataReshapeFn?: DataReshapeFn;
}

/**
 * Custom hook to manage form state and submission for login and password recovery forms.
 *
 * @param form - The form instance from react-hook-form
 * @param pageId - Unique identifier for the page, used for state management
 * @param submitRoute - API endpoint to submit the form data to
 * @param submitDataReshapeFn - Function to reshape form data before submission
 * @returns An object containing form state and handlers for submission and navigation
 */
export function useAppForm<T extends FieldValues = FieldValues>({
  form,
  pageId,
  submitRoute,
  submitDataReshapeFn,
}: UseAppFormProps<T>) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();

  const { submitCallback, ...rest } = useCommandHandler({
    form,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });
  const { response, error, isLoading } = rest;
  const login = useAppStore((state) => state.login);

  const resetFormAndTriggerNavigation = async () => {
    await wait(50);

    // !! IMPORTANT !! - Use startTransition to avoid blocking UI updates
    startTransition(() => {
      if (!open) setOpen(true);
      form.reset();
    });

    navigate("/", { replace: true });
  };

  /**
   * Handles form submission by calling the submitCallback from useCommandHandler with the appropriate parameters.
   *
   * @param variables - The form data to be submitted, which can be either LoginFormSchema or RecoveryFormSchema.
   */
  const onSubmit = (variables: T) => {
    submitCallback(variables as Record<string, unknown>, {
      method: HTTP_METHODS.POST,
      endpointUrl: String(submitRoute),
      dataReshapeFn: submitDataReshapeFn,
      reshapeOptions: { login },
      silent: true,
    });
  };

  /**
   * Effect to handle loading, success, and error states
   *
   * @description It will open the sidebar upon successful login and navigate to the home page.
   */
  useEffect(() => {
    if (isLoading && !toast.getToasts().some((t) => t.id === toastId)) {
      toast.dismiss();
      toast.loading("Connexion en cours...", {
        id: toastId,
      });
    }

    if (error || response) {
      toast.dismiss(toastId);
      // If there's an error, show an error toast
      if (error?.status === 400 || error?.status === 401) {
        toast.error(
          "Identifiant ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer.",
        );
      }
    }
  }, [isLoading, error, response]);

  return {
    ...rest,
    onSubmit,
    resetFormAndTriggerNavigation,
  };
}
