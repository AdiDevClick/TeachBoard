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
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { formsRegex } from "@/configs/formsRegex.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { useQueryOnSubmit } from "@/hooks/queries/useQueryOnSubmit.ts";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  useEffect,
  type ComponentProps,
  type FormEvent,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  identifier: z
    .string()
    .min(3, "Votre identifiant doit contenir au moins 3 caractères.")
    .max(64, "Votre identifiant ne peut contenir plus de 64 caractères.")
    .nonempty("L'identifiant est requis.")
    .transform((val) => {
      let cleaned = val;
      try {
        cleaned = cleaned.normalize("NFKD");
        cleaned = cleaned.replaceAll(/[\u0300-\u036f]/g, "");
      } catch {
        /* ignore if normalize not supported */
      }

      const pattern = cleaned.includes("@")
        ? formsRegex.allowedCharsEmailRemove
        : formsRegex.allowedCharsUsernameRemove;
      return cleaned.replaceAll(pattern, "");
    })
    .superRefine((val, ctx) => {
      // Conditional validation against server regexes
      if (val.includes("@")) {
        if (!formsRegex.serverEmail.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "Veuillez entrer une adresse email valide.",
          });
        }
      } else if (!formsRegex.serverUsername.test(val)) {
        ctx.addIssue({
          code: "custom",
          message:
            "Le nom d'utilisateur doit contenir au moins 3 caractères et être composé uniquement de lettres, chiffres, '.', '_' ou '-'.",
        });
      }
    })
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Votre mot de passe doit contenir au moins 1 caractère.")
    .max(100, "Votre mot de passe ne peut contenir plus de 100 caractères.")
    .nonempty("Le mot de passe est requis."),
});

const toastId = "login-loading";

/**
 * Login form component
 *
 * @param className - Additional class names for the component
 * @param props - Additional props for the component
 */
export function LoginForm({ className, ...props }: ComponentProps<"div">) {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const form = useForm<z.infer<typeof formSchema>>({
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

    if (data) {
      form.reset();
      navigate("/", { replace: true });
      if (!open) setOpen(true);
      toast.dismiss(toastId);
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
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="identifier">Identifiant</FieldLabel>
                    <Input
                      {...field}
                      id="identifier"
                      type="text"
                      // type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                      required
                      // Prevent forbidden chars on input (UX-friendly) and
                      // sanitize on change as a fallback.
                      onBeforeInput={(e: FormEvent<HTMLInputElement>) => {
                        const data = (e.nativeEvent as InputEvent).data;
                        // if the incoming character isn't allowed for ASCII email/username,
                        // prevent it immediately. Allow '@' so user can start an email.
                        if (
                          data &&
                          !formsRegex.allowedCharEmailTest.test(data)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const raw = (e.target as HTMLInputElement).value;
                        // normalize & remove diacritics first so accents become base letters
                        let normalized = raw;
                        try {
                          normalized = normalized.normalize("NFKD");
                          normalized = normalized.replaceAll(
                            /[\u0300-\u036f]/g,
                            ""
                          );
                        } catch {
                          /* ignore if normalize not supported */
                        }

                        const pattern = normalized.includes("@")
                          ? formsRegex.allowedCharsEmailRemove
                          : formsRegex.allowedCharsUsernameRemove;
                        const cleaned = normalized.replaceAll(pattern, "");
                        field.onChange(cleaned);
                      }}
                      value={field.value ?? ""}
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
