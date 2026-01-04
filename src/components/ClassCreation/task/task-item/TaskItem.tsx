import { TaskItemController } from "@/components/ClassCreation/task/task-item/controller/TaskItemController";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { taskItemInputControllers } from "@/data/inputs-controllers.data.ts";
import {
  type TaskItemCreationInputItem,
  type TaskItemFormSchema,
  taskItemCreationSchema,
} from "@/models/task-item.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Création d'une nouvelle tâche",
  description: "Ajoutez une nouvelle tâche pour les classes.",
};

const footerProps = { submitText: "Créer", cancelText: "Annuler" };

/**
 * View component for creating a new task item.
 *
 * @description This inits Zod validated form
 *
 * @param pageId - The ID of the page.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param modalMode - Whether the component is in modal mode.
 * @param props - Additional props.
 */
export function TaskItem({
  pageId = "new-task-item",
  inputControllers = taskItemInputControllers,
  modalMode = true,
  ...props
}: Readonly<PageWithControllers<TaskItemCreationInputItem>>) {
  const formId = pageId + "-form";

  const form = useForm<TaskItemFormSchema>({
    resolver: zodResolver(taskItemCreationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId: formId,
      },
      modalMode,
      titleProps,
      ...props,
      form,
    }),
    [form.formState, props]
  );

  return <TaskItemWithCard {...commonProps} />;
}

const TaskItemWithCard = withTitledCard(TaskItemController);
export default TaskItem;
