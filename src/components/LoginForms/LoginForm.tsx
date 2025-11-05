import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, type ComponentProps, type CSSProperties } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z
    .email()
    .min(5, "Votre email doit contenir au moins 5 caractères.")
    .max(32, "Votre email doit ne peut contenir plus de 32 caractères."),
  password: z
    .string()
    .min(1, "Votre mot de passe doit contenir au moins 1 caractère.")
    .max(100, "Votre mot de passe ne peut contenir plus de 100 caractères."),
});

/**
 *
 * @param param0
 * @returns
 */
export function LoginForm({ className, ...props }: ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
            onSubmit={form.handleSubmit(onSubmit)}
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
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                      <Link
                        to="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                      aria-invalid={fieldState.invalid}
                    />
                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />
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

/**
 * Handle form submission
 *
 * @param data - Form data
 */
function onSubmit(data: z.infer<typeof formSchema>) {
  toast("You submitted the following values:", {
    description: (
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
    position: "top-right",
    classNames: {
      content: "flex flex-col gap-2",
    },
    style: {
      "--border-radius": "calc(var(--radius) + 4px)",
    } as CSSProperties,
  });
  // toast.success("Form submitted successfully!");
}
