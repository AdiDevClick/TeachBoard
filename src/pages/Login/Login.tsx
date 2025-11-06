import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import type { InputController } from "@/components/LoginForms/types/LoginFormsTypes.ts";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { inputControllers } from "@/data/loginInputControllers";
import "@css/LoginPage.scss";
import { GalleryVerticalEnd } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Login page component
 *
 * @description This component renders the login page with a company logo and login form.
 */
export function Login() {
  const { open, setOpen } = useSidebar();

  /** Close sidebar on login page */
  useEffect(() => {
    if (open) setOpen(false);
  }, []);

  return (
    <div className="login-page-container">
      <div className="login-page__content">
        <Link to="/" className="login-page__logo">
          <div className="login-page__logo--background">
            <GalleryVerticalEnd className="login-page__logo--icon" />
          </div>
          Acme Inc.
        </Link>
        <LoginForm inputControllers={inputControllers as InputController[]} />
      </div>
    </div>
  );
}
