import type { WithStyledFormProps } from "@/components/HOCs/types/with-styled-form.types";
import withTitledCard from "@/components/HOCs/withTitledCard";
import { FooterFields } from "@/features/auth/components/login/LoginView";
import type { AnyComponentLike } from "@/utils/types/types.utils";

/**
 * Higher-Order Component that wraps a given component with a styled card layout, including a title, content, and footer.
 *
 * @remarks This HOC is designed to be flexible and can be used with any component that accepts the specified props. It utilizes the withTitledCard HOC to provide a consistent card layout and includes a FooterFields component for displaying form-related actions.
 *
 * @param Component
 */
export function withStyledForm<T extends AnyComponentLike>(Component: T) {
  return function FormComponent(props: WithStyledFormProps & T) {
    const Wrapped = withTitledCard(Component);

    return (
      <Wrapped {...props}>
        <Wrapped.Title />
        <Wrapped.Content />
        <Wrapped.Footer
          displaySubmitButton={false}
          displayCancelButton={false}
          separator={{ displaySeparator: true }}
          className="px-6"
        >
          <FooterFields
            form={props.form}
            formId={props.formId}
            textToDisplay={props.textToDisplay}
            onClick={props.onClick}
          />
        </Wrapped.Footer>
      </Wrapped>
    );
  };
}
