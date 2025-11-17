import { Inputs } from "@/components/Inputs/Inputs.tsx";
import type {
  SignupFormProps,
  SignupFormSchema,
  SignupInputItem,
} from "@/components/SignupForm/types/signup.types.ts";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { signupSchema } from "@/models/signup.models.ts";
import { cn } from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/**
 *
 * @param className
 */
export type SignupProps = Readonly<{
  modaleMode?: boolean;
  className?: string;
  inputControllers: SignupInputItem[];
}>;

export function Signup({
  modaleMode = false,
  className,
  inputControllers,
  ...props
}: SignupFormProps) {
  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      username: "",
    },
  });

  const queryFn = (data: SignupFormSchema) => {
    console.log("Register data:", data);
    toast.success("Inscription réussie !");
  };

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modaleMode ? DialogHeaderTitle : HeaderTitle;

  return (
    <Card className={cn("flex flex-col gap-6", className)} {...props}>
      <Title
        title="S'enregistrer"
        description="Rejoignez-nous pour faciliter votre quotidien !"
      />
      <CardContent>
        <form
          id="signup-form"
          onSubmit={form.handleSubmit(queryFn)}
          className="grid gap-4"
        >
          <FieldGroup>
            <Inputs items={inputControllers} form={form} />
            <Field>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                form="signup-form"
              >
                S'enregistrer
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
