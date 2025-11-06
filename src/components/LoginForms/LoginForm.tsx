import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { Inputs } from "@/components/Inputs/Inputs.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type {
  LoginFormProps,
  LoginFormSchema,
} from "@/components/LoginForms/types/LoginFormsTypes.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { useQueryOnSubmit } from "@/hooks/queries/useQueryOnSubmit.ts";
import { cn } from "@/lib/utils";
import { formSchema } from "@/models/login.models.ts";
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
 * @param props - Additional props for the component
 */
export function LoginForm({
  className,
  inputControllers,
  ...props
}: Readonly<LoginFormProps>) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { data, queryFn, isLoading, error } = useQueryOnSubmit([
    "login",
    {
      url: "/api/auth/login",
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
      toast.dismiss(toastId);
    }

    if (error?.cause?.status === 400 || error?.cause?.status === 401) {
      toast.dismiss();
      toast.error(
        "Identidiant ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer."
      );
    }

    if (data) {
      form.reset();
      navigate("/", { replace: true });
      if (!open) setOpen(true);
    }
  }, [isLoading, error, data, open]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Connectez-vous avec un de vos comptes sociaux ou par email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(queryFn)}
            className="grid gap-4"
          >
            <FieldGroup>
              <Field>
                <ListMapper items={loginButtonsSvgs}>
                  <LoginButton />
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
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link to="#">Terms of Service</Link> and{" "}
        <Link to="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
