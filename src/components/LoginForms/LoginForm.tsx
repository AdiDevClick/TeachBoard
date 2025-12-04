import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type {
  LoginFormSchema,
  LoginInputItem,
  RecoveryFormSchema,
} from "@/components/LoginForms/types/login-forms.types";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { DEV_MODE } from "@/configs/app.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import {
  inputLoginControllers,
  passwordRecoveryInputControllers,
} from "@/data/inputs-controllers.data.ts";

import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useLogin } from "@/hooks/database/login/useLogin.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { formSchema } from "@/models/login.models.ts";
import { pwRecoverySchema } from "@/models/pw-recovery.model.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import {
  handleModalOpening,
  preventDefaultAndStopPropagation,
  wait,
} from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const toastId = "login-loading";
const resetPasswordButtonText = "Réinitialiser le mot de passe";
const backToLoginLinkText = "Retour à la connexion";
const loginLinkTo = "/login";

type LoginFormProps = {
  pageId?: string;
  className?: string;
  inputControllers?: LoginInputItem[];
  modalMode?: boolean;
  formId?: string;
  form: ReturnType<typeof useForm<LoginFormSchema | RecoveryFormSchema>>;
  setIsPwForgotten: Dispatch<SetStateAction<boolean>>;
  isPwForgotten: boolean;
  textToDisplay: {
    pwForgottenLinkText: string;
    pwForgottenLinkTo: string;
    buttonText: string;
  };
};

/**
 * Login form component
 *
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects
 * @param modalMode - Flag to indicate if the form is in modal mode (default: false)
 * @param props - Additional props for the component
 */
function LoginFormController({
  pageId = "login-form-page-card",
  className = "grid gap-4",
  form,
  setIsPwForgotten,
  isPwForgotten,
  inputControllers = inputLoginControllers,
  modalMode = false,
  formId: formIdProp,
  textToDisplay,
}: Readonly<LoginFormProps>) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const { closeDialog, openDialog, closeAllDialogs } = useDialog();
  const user = useAppStore((state) => state.user);
  const { data, onSubmit, isLoading, error } = useLogin({ isPwForgotten });

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

      if (DEV_MODE) {
        console.debug("Mutation resolved", data);
      }
    }
  }, [isLoading, error, data, open, modalMode]);

  const handleRecoverPasswordClick = (e: MouseEvent<HTMLAnchorElement>) => {
    preventDefaultAndStopPropagation(e);
    if (isPwForgotten) {
      // already in recovery mode; allow navigation
      setIsPwForgotten(false);
    } else {
      setIsPwForgotten(true);
      form.reset();
    }
  };

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
          onClick={handleRecoverPasswordClick}
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

const titleProps = {
  title: "Welcome Back !",
  description: "Connectez-vous à votre compte TeachBoard.",
  className: "text-center",
};

function LoginForm({
  pageId = "login-form-page-card",
  modalMode = false,
  inputControllers = inputLoginControllers,
  ...props
}: Readonly<PageWithControllers<LoginInputItem>>) {
  const [isPwForgotten, setIsPwForgotten] = useState(false);

  const schemaToUse = isPwForgotten ? pwRecoverySchema : formSchema;

  const form = useForm<LoginFormSchema | RecoveryFormSchema>({
    resolver: zodResolver(schemaToUse),
    mode: "all",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  let inputControllersToUse = inputControllers;
  let pwForgottenLinkText = "Mot de passe oublié ?";
  let pwForgottenLinkTo = "/forgot-password";
  let buttonText = "Se connecter";

  if (isPwForgotten) {
    pwForgottenLinkText = backToLoginLinkText;
    pwForgottenLinkTo = loginLinkTo;
    buttonText = resetPasswordButtonText;
    inputControllersToUse = passwordRecoveryInputControllers;
  }

  const formId = pageId + "-form";

  const Component = withTitledCard(LoginFormController);

  const commonProps = useMemo(
    () => ({
      pageId,
      formId,
      form,
      setIsPwForgotten,
      isPwForgotten,
      modalMode,
      titleProps,
      displayFooter: false as const,
      inputControllers: inputControllersToUse,
      textToDisplay: {
        pwForgottenLinkText,
        pwForgottenLinkTo,
        buttonText,
      },
      ...props,
    }),
    [form.formState, setIsPwForgotten, isPwForgotten, props]
  );

  return <Component {...commonProps} />;
}

export default LoginForm;
