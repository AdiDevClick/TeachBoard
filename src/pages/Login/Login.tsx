import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { inputControllers } from "@/data/loginInputControllers";
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
export function Login() {
  const { open, setOpen } = useSidebar();

  /** Close sidebar on login page */
  useEffect(() => {
    if (open) setOpen(false);
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
