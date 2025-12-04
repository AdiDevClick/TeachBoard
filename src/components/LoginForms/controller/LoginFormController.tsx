import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink.tsx";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { handleRecoverPasswordClick } from "@/components/LoginForms/functions/login-forms.funtions.ts";
import type { LoginFormControllerProps } from "@/components/LoginForms/types/login-forms.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { DEV_MODE, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { inputLoginControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { handleModalOpening, wait } from "@/utils/utils.ts";
import { startTransition, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const toastId = "login-loading";

/**
 * Login form component
 *
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects
 * @param modalMode - Flag to indicate if the form is in modal mode (default: false)
 * @param props - Additional props for the component
 */
export function LoginFormController({
  pageId = "login-form-page-card",
  className = "grid gap-4",
  form,
  setIsPwForgotten,
  isPwForgotten,
  inputControllers = inputLoginControllers,
  modalMode = false,
  formId: formIdProp,
  textToDisplay,
  loginHooks,
}: Readonly<LoginFormControllerProps>) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const { closeDialog, openDialog, closeAllDialogs } = useDialog();
  const user = useAppStore((state) => state.user);
  const { data, onSubmit, isLoading, error } = loginHooks;

  const { setRef } = useMutationObserver({});

  /** Log user data on change (for development purposes) */
  useEffect(() => {
    if (user) {
      if (DEV_MODE) {
        console.debug("User in LoginForm useEffect:", user);
      }
    }
  }, [user]);

  /**
   * Effect to handle loading, success, and error states
   *
   * @description It will open the sidebar upon successful login and navigate to the home page.
   */
  useEffect(() => {
    const resetFormAndTriggerNavigation = async () => {
      await wait(500);

      // !! IMPORTANT !! - Use startTransition to avoid blocking UI updates
      startTransition(() => {
        if (!open) setOpen(true);
        form.reset();
        closeDialog(null, "login");
      });

      // Navigate ONLY after transitions are scheduled
      // avoids UI jank and an React render warning
      navigate("/", { replace: true });
    };

    if (isLoading) {
      toast.loading("Connexion en cours...", {
        id: toastId,
      });
    }

    if (error || data) {
      toast.dismiss(toastId);
      // If there's an error, show an error toast
    }

    if (data) {
      resetFormAndTriggerNavigation();

      if (isPwForgotten) {
        openDialog(null, "pw-recovery-email-sent");
      } else {
        toast.success("Connexion réussie !");
      }

      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("Query success in LoginForm", data);
      }
    }
  }, [isLoading, error, data, open, modalMode]);

  const formId = formIdProp ?? pageId + "-form";

  return (
    <form
      ref={(el) => setRef(el, { name: pageId, id: formId })}
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className={className}
    >
      <FieldGroup>
        <Field>
          <ListMapper items={loginButtonsSvgs}>
            <LoginButton
              ischild
              onClick={(e) => {
                openDialog(e, "apple-login");
              }}
            />
          </ListMapper>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Ou continuez avec
        </FieldSeparator>
        <ControlledInputList items={inputControllers} form={form} />
        <AppFieldDescriptionWithLink
          className="text-left"
          onClick={(e) =>
            handleRecoverPasswordClick({
              e,
              isPwForgotten,
              setIsPwForgotten,
              form,
            })
          }
          linkText={textToDisplay.pwForgottenLinkText}
          linkTo={textToDisplay.pwForgottenLinkTo}
        />
        <Field>
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            form={formId}
          >
            {textToDisplay.buttonText}
          </Button>
          <AppFieldDescriptionWithLink
            linkText="Inscrivez-vous ici"
            linkTo="/signup"
            onClick={(e) =>
              handleModalOpening({
                e,
                dialogFns: { closeAllDialogs, openDialog },
                modalName: "signup",
              })
            }
          >
            Vous n'avez pas de compte ?{" "}
          </AppFieldDescriptionWithLink>
        </Field>
      </FieldGroup>
    </form>
  );
}
