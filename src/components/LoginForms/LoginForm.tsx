import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { Inputs } from "@/components/Inputs/Inputs.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type {
  LoginFormProps,
  LoginFormSchema,
} from "@/components/LoginForms/types/LoginFormsTypes.ts";
import { Modale } from "@/components/Modale/Modale.tsx";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useLogin } from "@/hooks/database/login/useLogin.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { formSchema } from "@/models/login.models.ts";
import { Signup } from "@/pages/Signup/Signup.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const toastId = "login-loading";

/**
 * Login form component
 *
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects
 * @param props - Additional props for the component
 */
export function LoginForm({
  className,
  inputControllers,
  modalMode = false,
  ...props
}: Readonly<LoginFormProps>) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const { closeDialog, openDialog, isDialogOpen } = useDialog();
  const user = useAppStore((state) => state.user);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { data, queryFn, isLoading, error } = useLogin();

  useEffect(() => {
    if (isDialogOpen("apple")) {
      // Define here any actions needed when the dialog opens
      console.log("DialogOpen dans le loginforml");
    }

    if (!isDialogOpen("apple")) {
      console.log(
        "DialogOpen dans le loginforml essai de fermer autre chose que apple"
      );
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (user) {
      if (import.meta.env.DEV) {
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
      if (import.meta.env.DEV) {
        console.debug("Mutation resolved", data);
      }
      form.reset();
      if (modalMode) {
        closeDialog("login");
      } else {
        navigate("/", { replace: true });
      }
      if (!open) setOpen(true);
    }
  }, [isLoading, error, data, open, modalMode]);

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;

  return (
    <Card className={className} {...props}>
      <Title />
      <CardContent>
        <form
          id="login-form"
          onSubmit={form.handleSubmit(queryFn)}
          className="grid gap-4"
        >
          <FieldGroup>
            <Field>
              <Modale modaleName="apple" modaleContent={"test"}>
                <ListMapper items={loginButtonsSvgs}>
                  <LoginButton
                    ischild
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openDialog("apple");
                    }}
                  />
                </ListMapper>
              </Modale>
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Ou continuez avec
            </FieldSeparator>
            <Inputs items={inputControllers} form={form} />
            <Field>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                form="login-form"
              >
                Se connecter
              </Button>
              <FieldDescription className="text-center">
                Vous n'avez pas de compte ?{" "}
                <Modale
                  modaleName="signup"
                  modaleContent={<Signup modaleMode />}
                >
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openDialog("signup");
                    }}
                    to="/signup"
                  >
                    Inscrivez-vous ici
                  </Link>
                </Modale>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
