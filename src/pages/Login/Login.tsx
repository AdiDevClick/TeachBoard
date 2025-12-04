import LoginForm from "@/components/LoginForms/LoginForm.tsx";
import { FieldDescription } from "@/components/ui/field.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { inputLoginControllers } from "@/data/inputs-controllers.data";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import type { LoginPageProps } from "@/pages/Login/types/login-page.types.ts";
import {
  GENERIC_CONTAINER_STYLE,
  GENERIC_CONTENT_STYLE,
  GENERIC_LOGO_BACKGROUND_STYLE,
  GENERIC_LOGO_ICON_STYLE,
  GENERIC_LOGO_STYLE,
} from "@/utils/styles/generic-styles.ts";
import "@css/GenericPage.scss";
import { GalleryVerticalEnd } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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
    <div {...GENERIC_CONTAINER_STYLE}>
      <div {...GENERIC_CONTENT_STYLE}>
        <Link to="/" {...GENERIC_LOGO_STYLE}>
          <div {...GENERIC_LOGO_BACKGROUND_STYLE}>
            <GalleryVerticalEnd {...GENERIC_LOGO_ICON_STYLE} />
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
