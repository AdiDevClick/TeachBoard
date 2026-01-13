import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink.tsx";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { handleRecoverPasswordClick } from "@/components/LoginForms/functions/login-forms.funtions.ts";
import type { LoginFormControllerProps } from "@/components/LoginForms/types/login-forms.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, HTTP_METHODS, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { inputLoginControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import type {
  LoginFormSchema,
  RecoveryFormSchema,
} from "@/models/login.models.ts";
import { wait } from "@/utils/utils.ts";
import { startTransition, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const toastId = "login-loading";

/**
 * Login form component
 *
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects
 * @param props - Additional props for the component
 */
export function LoginFormController({
  pageId,
  className,
  form,
  setIsPwForgotten,
  isPwForgotten,
  inputControllers = inputLoginControllers,
  formId,
  textToDisplay,
}: Readonly<LoginFormControllerProps>) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const login = useAppStore((state) => state.login);
  const user = useAppStore((state) => state.user);

  const { error, isLoading, setRef, submitCallback, data, newItemCallback } =
    useCommandHandler({
      form,
      pageId,
    });

  // Prevent effect from re-running when `open` changes after login success
  const hasHandledLoginSuccess = useRef(false);

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
      await wait(50);

      // !! IMPORTANT !! - Use startTransition to avoid blocking UI updates
      startTransition(() => {
        if (!open) setOpen(true);
        form.reset();
      });

      navigate("/", { replace: true });
    };

    if (isLoading && !toast.getToasts().some((t) => t.id === toastId)) {
      toast.dismiss();
      toast.loading("Connexion en cours...", {
        id: toastId,
      });
    }

    if (error || data) {
      toast.dismiss(toastId);
      // If there's an error, show an error toast
      if (error?.status === 400 || error?.status === 401) {
        toast.error(
          "Identifiant ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer."
        );
      }
    }

    if (data && !hasHandledLoginSuccess.current) {
      hasHandledLoginSuccess.current = true;

      if (isPwForgotten) {
        newItemCallback({ task: "pw-recovery-email-sent" });
      } else {
        toast.success("Connexion réussie !", {
          id: "login-success-toast",
        });
      }

      resetFormAndTriggerNavigation();

      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("Query success in LoginForm", data);
      }
    }
  }, [isLoading, error, data]);

  const handleOnOpen = ({ e, ...rest }: HandleAddNewItemParams) => {
    newItemCallback({ e, ...rest });
  };

  /**
   * Handle Class Creation form submission
   *
   * @description Provided API endpoint and data reshaping function
   * in order to call the submit callback correctly.
   *
   * @param variables - The form data to submit
   */
  const handleSubmit = (variables: LoginFormSchema | RecoveryFormSchema) => {
    let GETendPoint = String(API_ENDPOINTS.POST.AUTH.LOGIN.endpoint);
    let POSTendPoint = API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape;

    if (isPwForgotten) {
      GETendPoint = API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.endpoint;
      POSTendPoint = API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.dataReshape;
    }

    submitCallback(variables, {
      method: HTTP_METHODS.POST,
      endpointUrl: GETendPoint,
      dataReshapeFn: POSTendPoint,
      reshapeOptions: { login },
      silent: true,
    });
  };

  return (
    <form
      ref={(el) => setRef(el, { name: pageId, id: formId })}
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className={className}
    >
      <FieldGroup>
        <Field>
          <ListMapper items={loginButtonsSvgs}>
            <LoginButton
              ischild
              onClick={(e) => {
                handleOnOpen({ e, task: "apple-login" });
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
          linkText={textToDisplay.defaultText}
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
              handleOnOpen({
                e,
                task: "signup",
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
