import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  TASK_ITEM_TITLE,
  TASK_ITEM_FOOTER,
} from "@/features/class-creation/components/TaskItem/config/task-item.configs";
import { TaskItemController } from "@/features/class-creation/components/TaskItem/controllers/TaskItemController";
import { taskItemInputControllers } from "@/features/class-creation/components/TaskItem/forms/task-item-inputs";
import {
  type TaskItemCreationInputItem,
  type TaskItemFormSchema,
  taskItemCreationSchema,
} from "@/features/class-creation/components/TaskItem/models/task-item.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  className = "grid gap-4",
  ...props
}: Readonly<PageWithControllers<TaskItemCreationInputItem>>) {
  const form = useForm<TaskItemFormSchema>({
    resolver: zodResolver(taskItemCreationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const formId = pageId + "-form";

  const commonProps = {
    pageId,
    inputControllers,
    formId,
    className,
    card: {
      card: { className },
      title: TASK_ITEM_TITLE,
      footer: {
        ...TASK_ITEM_FOOTER,
        formState: form.formState,
        formId: formId,
      },
    },
    modalMode,
    ...props,
    form,
  };

  return (
    <TaskItemWithCard {...commonProps}>
      <TaskItemWithCard.Title />
      <TaskItemWithCard.Content />
      <TaskItemWithCard.Footer />
    </TaskItemWithCard>
  );
}

const TaskItemWithCard = withTitledCard(TaskItemController);
export default TaskItem;
