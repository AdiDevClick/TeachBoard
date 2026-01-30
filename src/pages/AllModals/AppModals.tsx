import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { Modal, ModalWithSimpleAlert } from "@/components/Modal/Modal.tsx";
import { inputSignupControllers } from "@/data/inputs-controllers.data.ts";
import DegreeItem from "@/features/class-creation/components/DegreeItem/DegreeItem";
import {
  degreeCreationInputControllersDegree,
  degreeCreationInputControllersField,
  degreeCreationInputControllersYear,
} from "@/features/class-creation/components/DegreeItem/forms/degree-item-inputs";
import DegreeModule from "@/features/class-creation/components/DegreeModule/DegreeModule.tsx";
import DegreeModuleSkill from "@/features/class-creation/components/DegreeModuleSkill/DegreeModuleSkill.tsx";
import DiplomaCreation from "@/features/class-creation/components/DiplomaCreation/DiplomaCreation.tsx";
import { diplomaCreationInputControllers } from "@/features/class-creation/components/DiplomaCreation/forms/diploma-creation-inputs";
import ClassCreation from "@/features/class-creation/components/main/ClassCreation.tsx";
import SearchStudents from "@/features/class-creation/components/SearchStudents/SearchStudents.tsx";
import { SearchPrimaryTeacher } from "@/features/class-creation/components/SearchTeachers/SearchTeachers.tsx";
import TaskItem from "@/features/class-creation/components/TaskItem/TaskItem";
import TaskTemplateCreation from "@/features/class-creation/components/TaskTemplateCreation/TaskTemplateCreation";
import { inputLoginControllers } from "@/features/login/components/main/forms/login-inputs.ts";
import LoginForm from "@/features/login/components/main/LoginForm.tsx";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
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
      modalMode: true,
    },
  },
  {
    modalName: "create-diploma",
    modalContent: DiplomaCreation,
    ...baseNonNavigationalProps,
    modalProps: {
      isNavigationModal: false,
      className: "max-w-2",
    },
    contentProps: {
      modalMode: true,
      pageId: "create-diploma",
      inputControllers: diplomaCreationInputControllers,
    },
  },
  {
    modalName: "new-degree-item-degree",
    modalContent: DegreeItem,
    ...baseNonNavigationalProps,
    contentProps: {
      pageId: "new-degree-item-degree",
      inputControllers: degreeCreationInputControllersDegree,
    },
  },
  {
    modalName: "new-degree-item-year",
    modalContent: DegreeItem,
    ...baseNonNavigationalProps,
    contentProps: {
      pageId: "new-degree-item-year",
      inputControllers: degreeCreationInputControllersYear,
    },
  },
  {
    modalName: "new-degree-item-field",
    modalContent: DegreeItem,
    ...baseNonNavigationalProps,
    contentProps: {
      pageId: "new-degree-item-field",
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
  {
    modalName: "search-students",
    modalContent: SearchStudents,
    ...baseNonNavigationalProps,
  },
  {
    modalName: "search-primaryteacher",
    modalContent: SearchPrimaryTeacher,
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
 *
 * @remark If you pass through any dialogOptions, they will be spread out into the modal content component.
 */
export function AppModals({ modalsList = modals }: Readonly<AppModalsProps>) {
  const { dialogOptions } = useDialog();
  return (
    <ListMapper items={modalsList}>
      {(modal) => {
        if (!modal.type) return null;

        const modalName = modal.modalName;
        const dialogOpts = dialogOptions(modalName) ?? {};

        if (isStandardModal(modal)) {
          const StandardModalComponent = modal.type;
          const ContentComponent = modal.modalContent;

          const renderedContent = (
            <ContentComponent {...modal.contentProps} {...dialogOpts} />
          );

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
