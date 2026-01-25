import { TaskTemplateCreationController } from "@/components/ClassCreation/task/task-template/controller/TaskTemplateCreationController";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { taskTemplateCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import {
  type TaskTemplateCreationFormSchema,
  type TaskTemplateCreationInputItem,
  taskTemplateSchema,
} from "@/models/class-task-template.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Création de nouvelles tâches",
  description: "Ces tâches pourront être associées aux modules de compétences.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

/**
 * TaskTemplateCreation Component
 *
 * @param pageId - The unique identifier for the page/component using this controller
 * @param modalMode - Whether the component is used in a modal dialog or not
 * @param inputControllers - An array of input controller configurations
 */
function TaskTemplateCreation({
  pageId = "new-task-template",
  modalMode = true,
  className = "grid gap-4",
  inputControllers = taskTemplateCreationInputControllers,
  ...props
}: Readonly<PageWithControllers<TaskTemplateCreationInputItem>>) {
  const form = useForm<TaskTemplateCreationFormSchema>({
    resolver: zodResolver(taskTemplateSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      taskId: "",
      degreeConfigId: "",
      skills: [],
    },
  });
  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      modalMode,
      className,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      cardProps: { className },
      titleProps,
      ...props,
      form,
    }),
    [form.formState, props],
  );

  return <TaskTemplateCreationWithCard {...commonProps} />;
}

const TaskTemplateCreationWithCard = withTitledCard(
  TaskTemplateCreationController,
);

export default TaskTemplateCreation;
