import { useAppStore } from "@/api/store/AppStore";
import { useStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { attendanceRecordCreationBaseControllers } from "@/data/inputs-controllers.data.ts";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/models/attendance-record-creation.models.ts";
import { StepTwoController } from "@/pages/Evaluations/create/steps/two/controller/StepTwoController.tsx";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues } from "react-hook-form";

export const stepTwoTitleProps = {
  title: "Liste d'élèves",
  description: "Définir les élèves présents ainsi que leurs fonctions.",
};

export const stepTwoCardProps = {
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
export function StepTwo({
  pageId = "attendance-record-creation",
  modalMode = false,
  className = "content__right",
  // className = "grid gap-4 max-w-2xl mx-auto",
  inputControllers = attendanceRecordCreationBaseControllers,
  ...props
}: Readonly<PageWithControllers<AttendanceRecordCreationInputItem>>) {
  const user = useAppStore((state) => state.user);
  const selectedClass = useStepsCreationStore((state) => state.selectedClass);
  const students = useStepsCreationStore((state) => state.students);
  const tasks = useStepsCreationStore((state) => state.tasks);
  const preparedStudentsTasksSelection = useStepsCreationStore(
    (state) => state.getStudentsPresenceSelectionData
  );
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
    titleProps: stepTwoTitleProps,
    cardProps: stepTwoCardProps,
    ...props,
    form,
    user,
    students,
    selectedClass,
    tasks,
    preparedStudentsTasksSelection,
  };

  return <StepTwoWithCard displayFooter={false} {...commonProps} />;
}

const StepTwoWithCard = withTitledCard(StepTwoController);
