import { useAppStore } from "@/api/store/AppStore.ts";
import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { attendanceRecordCreationBaseControllers } from "@/data/inputs-controllers.data.ts";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/models/attendance-record-creation.models.ts";
import { StepThreeModuleSelectionController } from "@/pages/Evaluations/create/steps/three/controllers/StepThreeModuleSelectionController";
import { StepThreeStudentsEvaluationController } from "@/pages/Evaluations/create/steps/three/controllers/StepThreeStudentsEvaluationController.tsx";
import { StepThreeSubskillsSelectionController } from "@/pages/Evaluations/create/steps/three/controllers/StepThreeSubskillsSelectionController.tsx";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  useEffect,
  type Dispatch,
  type JSX,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

// Module selection
export const stepThreeModuleSelectionTitleProps = {
  title: "Liste des catégories",
  description: "Par quoi doit-on commencer ?",
};

export const stepThreeModuleSelectionCardProps = {
  cardClassName: "content__right",
  contentClassName: "right__content-container",
};

// Subskills selection
export const stepThreeSubskillsSelectionTitleProps = {
  title: "Notation des élèves",
  description: "Quelles sous-compétences évaluer ?",
};
export const stepThreeSubskillsSelectionCardProps = {
  cardClassName: "content__right",
  contentClassName: "right__content-container",
};

/**
 * Step Two component for creating attendance records.
 * @description This component is wrapped with a titled card layout using the `withTitledCard` HOC.
 *
 * @param pageId - The ID of the page.
 * @param modalMode - Whether the component is in modal mode.
 * @param className - Additional class names for the component.
 * @param inputControllers - The input controllers for the form.
 * @param props - Additional props.
 * @returns The Step Two component wrapped in a titled card.
 */
export function StepThree({
  pageId = "attendance-record-creation",
  modalMode = false,
  className = "content__right",
  // className = "grid gap-4 max-w-2xl mx-auto",
  inputControllers = attendanceRecordCreationBaseControllers,
  ...props
}: Readonly<PageWithControllers<AttendanceRecordCreationInputItem>>) {
  const [, setLeftContent] =
    useOutletContext<[JSX.Element, Dispatch<SetStateAction<JSX.Element>>]>();
  const user = useAppStore((state) => state.user);
  const selectedClass = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );
  const students = useEvaluationStepsCreationStore((state) => state.students);
  const tasks = useEvaluationStepsCreationStore((state) => state.tasks);
  const modules = useEvaluationStepsCreationStore(
    (state) => state.getAttendedModules,
  )();
  const preparedStudentsTasksSelection = useEvaluationStepsCreationStore(
    (state) => state.getStudentsPresenceSelectionData,
  )();
  const moduleSelectionState = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection,
  );
  const setShowStudentsEvaluation = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelectionIsClicked,
  );
  const selectedSubSkill = useEvaluationStepsCreationStore(
    (state) => state.subSkillSelection?.selectedSubSkill,
  );

  const form = useForm<AttendanceRecordCreationFormSchema & FieldValues>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance([])),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });

  const formId = pageId + "-form";
  let cardProps = stepThreeModuleSelectionCardProps;
  let titleProps = stepThreeModuleSelectionTitleProps;

  if (moduleSelectionState.isClicked) {
    cardProps = stepThreeSubskillsSelectionCardProps;
    stepThreeSubskillsSelectionTitleProps.description = `Vous évaluez "${selectedSubSkill?.name}"`;
    titleProps = stepThreeSubskillsSelectionTitleProps;
  }

  const commonProps = {
    pageId,
    modalMode,
    className,
    formId,
    inputControllers,
    titleProps: titleProps,
    cardProps: cardProps,
    ...props,
    form,
    user,
    students,
    modules,
    selectedClass,
    tasks,
    preparedStudentsTasksSelection,
  };

  const handlePreviousClick = (e: MouseEvent<SVGSVGElement>) => {
    preventDefaultAndStopPropagation(e);
    setShowStudentsEvaluation(false);
  };

  const onClickHandlerTest = (e, props) => {
    preventDefaultAndStopPropagation(e);
    console.log("SIMPLE TEST \n", e, props);
  };

  /**
   * Dispatch left content based on module selection state
   */
  useEffect(() => {
    if (
      moduleSelectionState.isClicked &&
      moduleSelectionState.selectedModuleSubSkills.length > 0
    ) {
      setLeftContent(
        <StepThreeSubskillsSelectionController
          {...commonProps}
          subSkills={moduleSelectionState.selectedModuleSubSkills}
        />,
      );
    } else {
      setLeftContent(null!);
    }

    return () => {
      setLeftContent(null!);
    };
  }, [
    moduleSelectionState.isClicked,
    moduleSelectionState.selectedModuleSubSkills,
  ]);

  return (
    <>
      {!moduleSelectionState.isClicked && (
        <ModuleSelection displayFooter={false} {...commonProps} />
      )}
      {moduleSelectionState.isClicked && (
        <>
          <IconArrowLeft
            className={
              stepThreeModuleSelectionCardProps.cardClassName + " arrow-back"
            }
            onClick={handlePreviousClick}
            data-name="modules-previous"
            // onClick={(e) => onClickHandler({ e, ...clickProps, index })}
          />
          <StudentsEvaluation displayFooter={false} {...commonProps} />
        </>
      )}
    </>
  );
}

const ModuleSelection = withTitledCard(StepThreeModuleSelectionController);
const StudentsEvaluation = withTitledCard(
  StepThreeStudentsEvaluationController,
);
