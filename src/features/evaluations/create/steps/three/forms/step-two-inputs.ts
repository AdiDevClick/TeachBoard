import type { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo.tsx";

export const attendanceRecordCreationBaseControllers = [
  {
    name: "students",
    title: "Tâches à évaluer",
    type: "button",
    placeholder: "Sélectionnez une tâche",
    fullWidth: true,
  },
] satisfies Parameters<typeof StepTwo>[0]["inputControllers"];
