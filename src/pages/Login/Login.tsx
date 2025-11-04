import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import "@css/LoginPage.scss";
import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Login page component
 *
 * @description This component renders the login page with a company logo and login form.
 */
export function Login() {
  return (
    <div className="login-page-container">
      <div className="login-page__content">
        <Link to="/" className="login-page__logo">
          <div className="login-page__logo--background">
            <GalleryVerticalEnd className="login-page__logo--icon" />
          </div>
          Acme Inc.
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
