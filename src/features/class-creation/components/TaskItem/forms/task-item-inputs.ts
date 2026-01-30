import type TaskItem from "@/features/class-creation/components/TaskItem/TaskItem";

export const taskItemInputControllers = [
  {
    name: "name",
    title: "Nom de la tâche",
    type: "text",
    placeholder: "Ex: Installer un système d'exploitation...",
  },
  {
    name: "description",
    title: "Description",
    type: "text",
    placeholder: "Ex: La tâche consiste à ...",
  },
] satisfies Parameters<typeof TaskItem>[0]["inputControllers"];
