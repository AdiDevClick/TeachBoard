import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { Inputs } from "@/components/Inputs/Inputs.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { LoginFormSchema } from "@/components/LoginForms/types/LoginFormsTypes.ts";
import { Modale } from "@/components/Modale/Modale.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field.tsx";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { inputControllers } from "@/data/loginInputControllers.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { formSchema } from "@/models/login.models.ts";
import { cn } from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "@radix-ui/react-dialog";
import { Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/**
 *
 * @param className
 * @returns
 */
export function Signup({ className, ...props }: Readonly<{}>) {
  const { closeDialog, openDialog, isDialogOpen } = useDialog();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const queryFn = (data: any) => {
    console.log("Register data:", data);
    toast.success("Inscription réussie !");
  };

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
              <Field>
                <Modale modaleName="register" modaleContent={"test"}>
                  <ListMapper items={loginButtonsSvgs}>
                    <LoginButton
                      ischild
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDialog("register");
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
