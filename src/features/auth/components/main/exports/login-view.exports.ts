import { withStyledForm } from "@/components/HOCs/withStyledForm";
import { AuthButtons } from "@/features/auth/components/main/components/AuthButtons/AuthButtons";

/**
 * Exporting the LoginView component wrapped with the withStyledForm HOC, which provides a styled card layout for the authentication buttons.
 *
 * @descriptions This will already shape the page with the title, content (including the authentication buttons), footer and the link to the password recovery page.
 *
 * @remark only the direct form components (LoginFormController and PwForgottenController) will be needed as children
 */
export const LoginPageView = withStyledForm(AuthButtons);
