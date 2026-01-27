import { useAppStore } from "@/api/store/AppStore.ts";
import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { Badge } from "@/components/ui/badge.tsx";
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
  useMemo,
  type Dispatch,
  type JSX,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

// Module selection
const stepThreeModuleSelectionCardProps = {
  card: { className: "content__right" },
  title: {
    title: "Liste des catégories",
    description: "Par quoi doit-on commencer ?",
  },
  content: {
    className: "right__content-container",
  },
};

// Subskills selection
const stepThreeSubskillsSelectionTitleProps = {
  title: "Notation des élèves",
  description: "Quelles sous-compétences évaluer ?",
};
const stepThreeSubskillsSelectionCardProps = {
  card: { className: "content__right" },
  title: stepThreeSubskillsSelectionTitleProps,
  content: {
    className: "right__content-container",
  },
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
  const tasks = useEvaluationStepsCreationStore((state) => state.tasks);
  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );
  const moduleSelectionState = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection,
  );
  const setShowStudentsEvaluation = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelectionIsClicked,
  );
  const selectedSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedSubSkill()),
  );
  const evaluatedStudentsForThisSubskill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getPresentStudentsWithAssignedTasks()),
  );

  const form = useForm<AttendanceRecordCreationFormSchema & FieldValues>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance([])),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });

  const formId = pageId + "-form";

  const card = useMemo(() => {
    if (!moduleSelectionState.isClicked) {
      return stepThreeModuleSelectionCardProps;
    }

    const description = selectedSubSkill?.name
      ? `Vous évaluez "${selectedSubSkill.name}"`
      : stepThreeSubskillsSelectionTitleProps.description;

    return {
      ...stepThreeSubskillsSelectionCardProps,
      title: {
        ...stepThreeSubskillsSelectionCardProps.title,
        description,
      },
    };
  }, [moduleSelectionState.isClicked, selectedSubSkill?.name]);

  const commonProps = useMemo(
    () => ({
      pageId,
      modalMode,
      className,
      formId,
      inputControllers,
      card,
      ...props,
      form,
      user,
      students: evaluatedStudentsForThisSubskill,
      modules,
      selectedClass: selectedClass ?? null,
      tasks,
    }),
    [
      card,
      evaluatedStudentsForThisSubskill,
      form,
      inputControllers,
      modules,
      props,
      selectedClass,
      tasks,
      user,
    ],
  );

  const handlePreviousClick = (e: MouseEvent<SVGSVGElement>) => {
    preventDefaultAndStopPropagation(e);
    setShowStudentsEvaluation(false);
  };

  /**
   * Dispatch left content based on module selection state
   */
  useEffect(() => {
    if (moduleSelectionState.isClicked) {
      setLeftContent(
        <StepThreeSubskillsSelectionController {...commonProps} />,
      );
    } else {
      setLeftContent(null!);
    }

    return () => {
      setLeftContent(null!);
    };
  }, [moduleSelectionState.isClicked]);

  return (
    <>
      {!moduleSelectionState.isClicked && (
        <ModuleSelection {...commonProps}>
          <ModuleSelection.Title />
          <ModuleSelection.Content />
        </ModuleSelection>
      )}
      {moduleSelectionState.isClicked && (
        <>
          <IconArrowLeft
            className={
              stepThreeModuleSelectionCardProps.card.className + " arrow-back"
            }
            onClick={handlePreviousClick}
            data-name="modules-previous"
          />
          <StudentsEvaluation
            {...commonProps}
            card={{
              ...commonProps.card,
              title: {
                ...commonProps.card.title,
                description: <Badge>{selectedSubSkill?.name}</Badge>,
              },
            }}
          >
            <StudentsEvaluation.Title />
            <StudentsEvaluation.Content />
          </StudentsEvaluation>
        </>
      )}
    </>
  );
}

const ModuleSelection = withTitledCard(StepThreeModuleSelectionController);
const StudentsEvaluation = withTitledCard(
  StepThreeStudentsEvaluationController,
);
