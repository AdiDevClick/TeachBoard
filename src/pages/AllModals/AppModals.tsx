import ClassCreation from "@/components/ClassCreation/ClassCreation.tsx";
import DegreeItem from "@/components/ClassCreation/diploma/degree-item/DegreeItem";
import DegreeModuleSkill from "@/components/ClassCreation/diploma/degree-module-skill/DegreeModuleSkill.tsx";
import DegreeModule from "@/components/ClassCreation/diploma/degree-module/DegreeModule.tsx";
import DiplomaCreation from "@/components/ClassCreation/diploma/DiplomaCreation.tsx";
import TaskItem from "@/components/ClassCreation/task/task-item/TaskItem";
import TaskTemplateCreation from "@/components/ClassCreation/task/task-template/TaskTemplateCreation";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import LoginForm from "@/components/LoginForms/LoginForm.tsx";
import { Modal, ModalWithSimpleAlert } from "@/components/Modal/Modal.tsx";
import {
  degreeCreationInputControllersDegree,
  degreeCreationInputControllersField,
  degreeCreationInputControllersYear,
  degreeModuleCreationInputControllers,
  inputLoginControllers,
  inputSignupControllers,
} from "@/data/inputs-controllers.data.ts";
import {
  defineStrictModalsList,
  isStandardModal,
  type AppModalsProps,
} from "@/pages/AllModals/types/modals.types.ts";
import { Signup } from "@/pages/Signup/Signup.tsx";

const baseNonNavigationalProps = {
  type: Modal,
  modalProps: {
    isNavigationModal: false,
  },
  contentProps: {
    modalMode: true,
  },
};

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
    type: ModalWithSimpleAlert,
    modalProps: {
      isNavigationModal: false,
      headerTitle: "Demande envoyée",
      headerDescription:
        "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
    },
  },
  {
    modalName: "class-creation",
    type: Modal,
    modalContent: ClassCreation,
    modalProps: {
      isNavigationModal: false,
    },
    contentProps: {
      // inputControllers: inputSignupControllers,
      modalMode: true,
    },
  },
  {
    modalName: "create-diploma",
    modalContent: DiplomaCreation,
    ...baseNonNavigationalProps,
    modalProps: {
      className: "max-w-2",
    },
    contentProps: {
      inputControllers: degreeModuleCreationInputControllers,
    },
  },
  {
    modalName: "new-degree-item-degree",
    modalContent: DegreeItem,
    ...baseNonNavigationalProps,
    contentProps: {
      inputControllers: degreeCreationInputControllersDegree,
    },
  },
  {
    modalName: "new-degree-item-year",
    modalContent: DegreeItem,
    ...baseNonNavigationalProps,
    contentProps: {
      inputControllers: degreeCreationInputControllersYear,
    },
  },
  {
    modalName: "new-degree-item-field",
    modalContent: DegreeItem,
    ...baseNonNavigationalProps,
    contentProps: {
      inputControllers: degreeCreationInputControllersField,
    },
  },
  {
    modalName: "new-degree-module",
    modalContent: DegreeModule,
    ...baseNonNavigationalProps,
  },
  {
    modalName: "new-degree-module-skill",
    modalContent: DegreeModuleSkill,
    ...baseNonNavigationalProps,
  },
  {
    modalName: "new-task-template",
    modalContent: TaskTemplateCreation,
    ...baseNonNavigationalProps,
  },
  {
    modalName: "new-task-item",
    modalContent: TaskItem,
    ...baseNonNavigationalProps,
  },
  // {
  //   modalName: "new-task",
  //   type: Modal,
  //   modalContent: TaskCreation,
  //   modalProps: { isNavigationModal: false },
  //   contentProps: { modalMode: true },
  // },
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
  return (
    <ListMapper items={modalsList}>
      {(modal) => {
        if (!modal.type) return null;

        const modalName = modal.modalName;

        if (isStandardModal(modal)) {
          const StandardModalComponent = modal.type;
          const ContentComponent = modal.modalContent;

          const renderedContent = <ContentComponent {...modal.contentProps} />;

          return (
            <StandardModalComponent
              key={"modal-" + modalName + "-" + modal.id}
              modalName={modalName}
              modalContent={renderedContent}
              {...(modal.modalProps ?? {})}
            />
          );
        }

        const SimpleAlertComponent = modal.type;

        return (
          <SimpleAlertComponent
            key={"simple-modal-" + modalName + "-" + modal.id}
            modalName={modalName}
            {...modal.modalProps}
          />
        );
      }}
    </ListMapper>
  );
}
