import type {
  AuthLoginError,
  AuthLoginSuccess,
} from "@/api/types/routes/auth.types";
import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { Inputs } from "@/components/Inputs/Inputs.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type {
  LoginFormProps,
  LoginFormSchema,
} from "@/components/LoginForms/types/LoginFormsTypes.ts";
import {
  HeaderTitle,
  WithDialogHeader,
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
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useQueryOnSubmit } from "@/hooks/queries/useQueryOnSubmit.ts";
import { cn } from "@/lib/utils";
import { formSchema } from "@/models/login.models.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const [button, setButton] = useState({
    isClicked: false,
    name: "",
    id: "",
  });

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { data, queryFn, isLoading, error } = useQueryOnSubmit<
    AuthLoginSuccess,
    AuthLoginError
  >([
    "login",
    {
      url: API_ENDPOINTS.POST.AUTH.LOGIN,
      method: "POST",
      successDescription: "Vous êtes maintenant connecté(e).",
    },
  ]);

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
      const status = error?.status;
      toast.dismiss(toastId);

      if (status === 400 || status === 401) {
        toast.dismiss();
        toast.error(
          "Identifiant ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer."
        );
      }
    }

    if (data) {
      if (import.meta.env.DEV) {
        console.debug("Mutation resolved", data);
      }
      form.reset();
      if (modalMode) {
        closeDialog();
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
  const Title = modalMode ? HeaderTitle : WithDialogHeader;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <Title />
        <CardContent>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(queryFn)}
            className="grid gap-4"
          >
            <FieldGroup>
              {/* <DialogTrigger
                asChild
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isDialogOpen) {
                    console.log(
                      "The inner part should respond on click and this message will appear. This area is fully customizable => ",
                      isDialogOpen
                    );
                    console.log("Here is the button actual state => ", button);
                  } else {
                    console.log(
                      "The click occured outside the modal or on the close button, the button state will be reset - We need to be false => ",
                      isDialogOpen
                    );
                    setButton({
                      isClicked: false,
                      name: "",
                      id: "",
                    });
                  }
                }}
              > */}
              <Field>
                <ListMapper items={loginButtonsSvgs}>
                  {(icon) => (
                    // <div
                    //   key={icon.name}
                    //   className="w-full max-w-full"
                    //   id={icon.name}
                    // >
                    <LoginButton
                      key={icon.name}
                      icon={icon}
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   e.stopPropagation();

                      //   openDialog(true);
                      //   setButton({
                      //     isClicked: true,
                      //     name: icon.name,
                      //     id: icon.name,
                      //   });
                      // }}
                    />
                  )}
                </ListMapper>
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
                  <Link to="/signup">Inscrivez-vous ici</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
