import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink";
import type { WithStyledFormProps } from "@/components/HOCs/types/with-styled-form.types";
import withTitledCard from "@/components/HOCs/withTitledCard";
import { handleRecoverPasswordClick } from "@/features/auth/components/login/functions/login-forms.funtions";
import { FooterFields } from "@/features/auth/components/main/components/Footers/FooterFields";
import type { AnyComponentLike } from "@/utils/types/types.utils";
import type { ComponentProps } from "react";

/**
 * Higher-Order Component that wraps a given component with a styled card layout, including a title, content, and footer.
 *
 * @remarks This HOC is designed to be flexible and can be used with any component that accepts the specified props. It utilizes the withTitledCard HOC to provide a consistent card layout and includes a FooterFields component for displaying form-related actions.
 *
 * @param Component
 */
export function withStyledForm<T extends AnyComponentLike>(Component: T) {
  return function FormComponent(props: WithStyledFormProps<ComponentProps<T>>) {
    const Wrapped = withTitledCard(Component);

    const { textToDisplay, isPwForgotten, setIsPwForgotten, form, formId } =
      props;

    return (
      <Wrapped {...props}>
        <Wrapped.Title />
        <Wrapped.Content>
          <AppFieldDescriptionWithLink
            className="text-left pt-6"
            onClick={(e) =>
              handleRecoverPasswordClick({
                e,
                isPwForgotten,
                setIsPwForgotten,
                form,
              })
            }
            linkText={textToDisplay.defaultText}
            linkTo={textToDisplay.pwForgottenLinkTo}
          />
        </Wrapped.Content>
        <Wrapped.Footer
          displaySubmitButton={false}
          displayCancelButton={false}
          separator={{ displaySeparator: true }}
          className="px-6"
        >
          <FooterFields
            form={form}
            formId={formId}
            textToDisplay={textToDisplay}
            pageId={props.pageId}
          />
        </Wrapped.Footer>
      </Wrapped>
    );
  };
}
