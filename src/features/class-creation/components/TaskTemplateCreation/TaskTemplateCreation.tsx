import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  TASK_TEMPLATE_FOOTER,
  TASK_TEMPLATE_TITLE,
} from "@/features/class-creation/components/TaskTemplateCreation/config/task-template-creation.configs";
import { TaskTemplateCreationController } from "@/features/class-creation/components/TaskTemplateCreation/controllers/TaskTemplateCreationController";
import {
  type TaskTemplateCreationFormSchema,
  type TaskTemplateCreationInputItem,
  taskTemplateSchema,
} from "@/features/class-creation/components/TaskTemplateCreation/models/class-task-template.models";
import { taskTemplateCreationInputControllers } from "@/features/class-creation/index.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

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
      modules: [],
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
      card: {
        card: { className },
        title: TASK_TEMPLATE_TITLE,
        footer: {
          ...TASK_TEMPLATE_FOOTER,
          formState: form.formState,
          formId,
        },
      },
      ...props,
      form,
    }),
    [form.formState, props],
  );

  return (
    <TaskTemplateCreationWithCard {...commonProps}>
      <TaskTemplateCreationWithCard.Title />
      <TaskTemplateCreationWithCard.Content />
      <TaskTemplateCreationWithCard.Footer />
    </TaskTemplateCreationWithCard>
  );
}

const TaskTemplateCreationWithCard = withTitledCard(
  TaskTemplateCreationController,
);

export default TaskTemplateCreation;
