import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { useSignupValidation } from "@/hooks/database/signup/email-validation/useSignupValidation.ts";
import { EmailValidationController } from "@/pages/Email/controller/EmailValidationController.tsx";
import type { EmailValidationProps } from "@/pages/Signup/types/signup.types.ts";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

let title = "Validation de votre inscription";
const descriptionInit = "Vérification en cours...";

/**
 * Email Validation View
 *
 * @description This simply pass the Query hook props to the controller so it can re-render easily
 *
 * @param pageId - ID for the page container
 * @param modalMode - Whether to display in modal mode
 */
function EmailValidation({
  pageId = "email-validation-header",
  modalMode = false,
}: Readonly<EmailValidationProps>) {
  const urlParams = useParams();
  const url =
    API_ENDPOINTS.GET.AUTH.SIGNUP_VALIDATION +
    `${urlParams.referral}/${urlParams.referralCode}`;
  const queryHooks = useSignupValidation({
    url,
  });

  const { data, error } = queryHooks;

  const commonProps = useMemo(() => {
    const description = (data?.success || error?.message) ?? descriptionInit;

    if (data?.success) title = "Succès !";
    else if (error?.message) title = "Échec de la validation...";

    return {
      pageId,
      modalMode,
      displayFooter: false as const,
      titleProps: {
        title,
        description,
      },
      ...queryHooks,
    };
  }, [url, data, error]);

  return <EmailValidationWithCard {...commonProps} />;
}

const EmailValidationWithCard = withTitledCard(EmailValidationController);

export default EmailValidation;
