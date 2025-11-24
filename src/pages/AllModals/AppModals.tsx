import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { Modal, WithSimpleAlert } from "@/components/Modal/Modal.tsx";
import {
  inputLoginControllers,
  inputSignupControllers,
} from "@/data/inputs-controllers.data.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import {
  defineStrictModalsList,
  isStandardModal,
  type AppModalsProps,
} from "@/pages/AllModals/types/modals.types.ts";
import { Signup } from "@/pages/Signup/Signup.tsx";

const modals = defineStrictModalsList([
  {
    modalName: "login",
    type: Modal,
    modalContent: LoginForm,
    contentProps: {
      inputControllers: inputLoginControllers,
      modalMode: true,
    },
  },
  {
    modalName: "signup",
    type: Modal,
    modalContent: Signup,
    contentProps: {
      inputControllers: inputSignupControllers,
      modalMode: true,
    },
  },
  {
    modalName: "apple-login",
    type: Modal,
    modalContent: LoginForm,
    contentProps: {
      inputControllers: inputLoginControllers,
      modalMode: true,
    },
  },
  {
    modalName: "pw-recovery-email-sent",
    type: WithSimpleAlert,
    modalProps: {
      headerTitle: "Demande envoyée",
      headerDescription:
        "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
    },
  },
]) satisfies Parameters<typeof AppModals>[0]["modalsList"];

/**
 * AppModals component to render all modals used in the application.
 *
 * @param modalsList - List of modal configurations to render.
 *
 * @description The list have to be created with defineStrictModalsList to ensure proper typing.
 * {@link modals}
 */
export function AppModals({ modalsList = modals }: Readonly<AppModalsProps>) {
  const { setRef, observedRef } = useMutationObserver({});

  return (
    <ListMapper items={modalsList}>
      {(modal) => {
        if (!modal.type) return null;

        const modalName = modal.modalName;

        if (isStandardModal(modal)) {
          const StandardModalComponent = modal.type;
          const ContentComponent = modal.modalContent;

          const renderedContent = (
            <ContentComponent ref={setRef} {...modal.contentProps} />
          );

          return (
            <StandardModalComponent
              key={modalName}
              onNodeReady={observedRef}
              modalName={modalName}
              modalContent={renderedContent}
              {...(modal.modalProps ?? {})}
            />
          );
        }

        const SimpleAlertComponent = modal.type;

        return (
          <SimpleAlertComponent
            key={modalName}
            onNodeReady={observedRef}
            modalName={modalName}
            ref={setRef}
            {...modal.modalProps}
          />
        );
      }}
    </ListMapper>
  );
}
