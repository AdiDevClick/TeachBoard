import { useAppStore } from "@/api/store/AppStore";
import { rightContent } from "@/assets/css/EvaluationPage.module.scss";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { attendanceRecordCreationBaseControllers } from "@/features/evaluations/create/steps/three/forms/step-two-inputs.ts";
import { STEP_TWO_CARD_PROPS } from "@/features/evaluations/create/steps/two/config/step-two.configs";
import { StepTwoController } from "@/features/evaluations/create/steps/two/controller/StepTwoController.tsx";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues } from "react-hook-form";

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
export function StepTwo({
  pageId = "evaluation-attendance",
  modalMode = false,
  className = rightContent,
  inputControllers = attendanceRecordCreationBaseControllers,
  ...props
}: Readonly<PageWithControllers<AttendanceRecordCreationInputItem>>) {
  const user = useAppStore((state) => state.user);
  const selectedClass = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );
  const students = useEvaluationStepsCreationStore((state) => state.students);
  const tasks = useEvaluationStepsCreationStore((state) => state.tasks);
  const preparedStudentsTasksSelection = useEvaluationStepsCreationStore(
    (state) => state.getStudentsPresenceSelectionData,
  )();
  const form = useForm<AttendanceRecordCreationFormSchema & FieldValues>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance([])),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });

  const formId = pageId + "-form";

  const commonProps = {
    pageId,
    modalMode,
    className,
    formId,
    inputControllers,
    card: STEP_TWO_CARD_PROPS,
    ...props,
    form,
    user,
    students,
    selectedClass,
    tasks,
    preparedStudentsTasksSelection,
  };

  return (
    <StepTwoWithCard {...commonProps}>
      <StepTwoWithCard.Title />
      <StepTwoWithCard.Content />
    </StepTwoWithCard>
  );
}

const StepTwoWithCard = withTitledCard(StepTwoController);
