import { useAppStore } from "@/api/store/AppStore.ts";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { attendanceRecordCreationBaseControllers } from "@/data/inputs-controllers.data.ts";
import { useStepThreeState } from "@/hooks/eval-creation-steps/useStepThreeState.ts";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/models/attendance-record-creation.models.ts";
import { STEP_FOUR_CARD_PROPS } from "@/pages/Evaluations/create/steps/four/config/step-four.configs.ts";
import { StepFourController } from "@/pages/Evaluations/create/steps/four/controller/StepFourController.tsx";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ComponentProps,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

/**
 * STEP FOUR - Summary and Confirmation Component
 *
 * @description This component is wrapped with a titled card layout using the `withTitledCard` HOC.
 *
 * @param pageId - The ID of the page.
 * @param modalMode - Whether the component is in modal mode.
 * @param className - Additional class names for the component.
 * @param inputControllers - The input controllers for the form.
 * @param props - Additional props.
 *
 * @returns The Step Four component wrapped in a titled card.
 */
export function StepFour({
  pageId = "evaluation-summary",
  modalMode = false,
  className = "content__right",
  inputControllers = attendanceRecordCreationBaseControllers,
  ...props
}: Readonly<PageWithControllers<AttendanceRecordCreationInputItem>>) {
  const [, setLeftContent] =
    useOutletContext<[JSX.Element, Dispatch<SetStateAction<JSX.Element>>]>();
  const user = useAppStore((state) => state.user);
  const {
    selectedClass,
    tasks,
    modules,
    moduleSelectionState,
    setShowStudentsEvaluation,
    selectedSubSkill,
    evaluatedStudentsForThisSubskill,
  } = useStepThreeState();

  const form = useForm<AttendanceRecordCreationFormSchema & FieldValues>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance([])),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });

  const formId = pageId + "-form";

  const baseCardProps = {
    pageId,
    modalMode,
    className,
    formId,
    inputControllers,
    card: STEP_FOUR_CARD_PROPS,
    ...props,
    form,
  };

  return <ShowSummary {...baseCardProps} />;
}

/**
 * Convenient function to show students evaluation component
 */
function ShowSummary(commonProps: ComponentProps<typeof Summary>) {
  return (
    <Summary {...commonProps}>
      <Summary.Title />
      <Summary.Content />
    </Summary>
  );
}

const Summary = withTitledCard(StepFourController);
