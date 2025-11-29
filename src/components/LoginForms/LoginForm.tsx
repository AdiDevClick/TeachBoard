import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink.tsx";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type {
  LoginFormSchema,
  LoginInputItem,
  RecoveryFormSchema,
} from "@/components/LoginForms/types/login-forms.types";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { DEV_MODE } from "@/configs/app.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { passwordRecoveryInputControllers } from "@/data/inputs-controllers.data.ts";
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
import { useEffect, useState, type MouseEvent, type Ref } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const toastId = "login-loading";
const resetPasswordButtonText = "Réinitialiser le mot de passe";
const backToLoginLinkText = "Retour à la connexion";
const loginLinkTo = "/login";

/**
 * Login form component
 *
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects
 * @param modalMode - Flag to indicate if the form is in modal mode (default: false)
 * @param props - Additional props for the component
 */
export function LoginForm({
  ref,
  pageId = "login-form-page-card",
  className,
  inputControllers,
  modalMode = false,
  ...props
}: Readonly<PageWithControllers<LoginInputItem>>) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const { closeDialog, openDialog, closeAllDialogs } = useDialog();
  const user = useAppStore((state) => state.user);
  const [isPwForgotten, setIsPwForgotten] = useState(false);
  const { data, onSubmit, isLoading, error } = useLogin({ isPwForgotten });

  const schemaToUse = isPwForgotten ? pwRecoverySchema : formSchema;

  const form = useForm<LoginFormSchema | RecoveryFormSchema>({
    resolver: zodResolver(schemaToUse),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { setRef, observedRefs } = useMutationObserver({});

  // useEffect(() => {
  //   if (!pageId || !observedRefs) return;
  //   const key = `${pageId}-form`;
  //   const element = observedRefs.get(key)?.element;
  //   if (element) form.setFocus("identifier");
  // }, [observedRefs, pageId]);
  // useEffect(() => {
  //   if (observedRefs.size > 0) {
  //     form.setFocus("identifier");
  //   }
  // }, [observedRefs]);

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
      if (!open) setOpen(true);
      form.reset();

      closeDialog(null, "login");
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
        // if (isPwForgotten && observedRefs.get("pw-recovery-email-sent")) {
        // if (isPwForgotten && observedRefs) {
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

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;

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

  return (
    <Card id={pageId} ref={ref} className={className} {...props}>
      <Title />
      <CardContent>
        <form
          ref={setRef}
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
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
            <ControlledInputList items={inputControllersToUse} form={form} />
            <AppFieldDescriptionWithLink
              className="text-left"
              onClick={handleRecoverPasswordClick}
              linkText={pwForgottenLinkText}
              linkTo={pwForgottenLinkTo}
            />
            <Field>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                form={formId}
              >
                {buttonText}
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
      </CardContent>
    </Card>
  );
}
