import { TaskTemplateCreationController } from "@/components/ClassCreation/task/task-template/controller/TaskTemplateCreationController";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { taskTemplateCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import {
  type TaskTemplateCreationFormSchema,
  taskTemplateSchema,
} from "@/models/class-task-template.models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Création de nouvelles tâches",
  description: "Ces tâches pourront être associées aux modules de compétences.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

function TaskTemplateCreation({
  pageId = "new-task-template",
  modalMode = true,
  inputControllers = taskTemplateCreationInputControllers,
  ...props
}) {
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
      form,
      modalMode,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      titleProps,
      ...props,
    }),
    [form.formState, props]
  );

  return <TaskTemplateCreationWithCard {...commonProps} />;
}

const TaskTemplateCreationWithCard = withTitledCard(
  TaskTemplateCreationController
);

export default TaskTemplateCreation;
