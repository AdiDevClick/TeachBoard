import { useAppStore } from "@/api/store/AppStore.ts";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState.ts";
import { STEP_FOUR_CARD_PROPS } from "@/features/evaluations/create/steps/four/config/step-four.configs.ts";
import { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController.tsx";
import { attendanceRecordCreationBaseControllers } from "@/features/evaluations/create/steps/three/forms/step-two-inputs.ts";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
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
      <Summary.Footer />
    </Summary>
  );
}

const Summary = withTitledCard(StepFourController);
