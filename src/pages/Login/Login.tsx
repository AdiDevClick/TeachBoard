import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { FieldDescription } from "@/components/ui/field.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { inputLoginControllers } from "@/data/inputs-controllers.data";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import type { LoginPageProps } from "@/pages/Login/types/login-page.types.ts";
import "@css/LoginPage.scss";
import { GalleryVerticalEnd } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

/** Use it once or insert it into the component
 * if you need to add dynamic styles based on props or state
 * in the future.
 */
const {
  containerStyle,
  contentStyle,
  logoStyle,
  logoBackgroundStyle,
  logoIconStyle,
} = loginStyle();

/**
 * Login page component
 *
 * @description This component renders the login page with a company logo and login form.
 */
export function Login({
  inputControllers = inputLoginControllers,
}: LoginPageProps) {
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar();
  const { closeAllDialogs } = useDialog();

  /** Close sidebar on login page */
  useEffect(() => {
    if (open || openMobile) {
      setOpen(false);
      setOpenMobile(false);
    }
    closeAllDialogs();
  }, []);

  return (
    <div {...containerStyle}>
      <div {...contentStyle}>
        <Link to="/" {...logoStyle}>
          <div {...logoBackgroundStyle}>
            <GalleryVerticalEnd {...logoIconStyle} />
          </div>
          Acme Inc.
        </Link>
        <LoginForm inputControllers={inputControllers} />
        <FieldDescription className="px-6 text-center">
          En cliquant sur "Se connecter", vous acceptez nos{" "}
          <Link to="#">Conditions d'utilisation</Link> et{" "}
          <Link to="#">Politique de confidentialité</Link>.
        </FieldDescription>
      </div>
    </div>
  );
}

/**
 * Styles for the login page
 *
 * @returns An object containing class names for the login page elements.
 */
function loginStyle() {
  const loginPage = "login-page";

  return {
    containerStyle: { className: `${loginPage}-container` },
    contentStyle: { className: `${loginPage}__content` },
    logoStyle: { className: `${loginPage}__logo` },
    logoBackgroundStyle: { className: `${loginPage}__logo--background` },
    logoIconStyle: { className: `${loginPage}__logo--icon` },
  };
}
