import type { ViewCardContextType } from "@/api/contexts/types/context.types";
import withTitledCard from "@/components/HOCs/withTitledCard";
import { Modal } from "@/components/Modal/Modal";
import type { WithSimpleAlertProps } from "@/components/Modal/types/modal.types";
import type {
  AnyComponentLike,
  ComponentPropsOf,
} from "@/utils/types/types.utils";
import { createComponentName } from "@/utils/utils";

/**
 * Higher-order component to create a simple alert modal
 *
 * @description This contains a title, description and an Ok button to close the modal.
 */
export const ModalWithSimpleAlert = withSimpleAlert(Modal);
createComponentName(
  "withSimpleAlert",
  "ModalWithSimpleAlert",
  ModalWithSimpleAlert,
);

function withSimpleAlert<T extends AnyComponentLike>(WrappedComponent: T) {
  return function Component(props: WithSimpleAlertProps) {
    const { headerTitle, ref, headerDescription, ...rest } = props;

    const commonProps = {
      modalMode: true,
      ref,
      pageId: rest.modalName ?? "simple-alert",
      card: {
        title: {
          title: headerTitle,
          description: headerDescription,
          separator: {
            displaySeparator: false,
          },
        },
        footer: {
          className: "px-6",
          separator: {
            displaySeparator: false,
          },
          cancelText: "Ok",
          displaySubmitButton: false,
        },
      } satisfies ViewCardContextType,
    };

    const injectedProps = {
      ...rest,
      modalContent: (
        <SimpleAlert {...commonProps}>
          <SimpleAlert.Title />
          <SimpleAlert.Footer />
        </SimpleAlert>
      ),
    };

    return <WrappedComponent {...(injectedProps as ComponentPropsOf<T>)} />;
  };
}

const SimpleAlert = withTitledCard(null!);
