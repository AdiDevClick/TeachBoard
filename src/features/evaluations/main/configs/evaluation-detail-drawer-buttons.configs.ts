import type { EvaluationDetailDrawerButtonProps } from "@/features/evaluations/preview-view/components/drawer-button/types/evaluation-detail-drawer-button";

/**
 * Data for the buttons displayed in the EvaluationDetailDrawer component
 *
 * @description This serves the purpose of centralizing the button configurations for CRUD operations related to evaluations.
 */
export const buttonsData: EvaluationDetailDrawerButtonProps[] = [
  { label: "Ouvrir", getLink: (id: number | string) => `/evaluations/${id}` },
  {
    label: "Editer",
    getLink: (id: number | string) => `/evaluations/edit/${id}`,
  },
  {
    label: "Supprimer",
    getLink: (id: number | string) => `/evaluations/delete/${id}`,
  },
];
