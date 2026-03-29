import type { UUID } from "@/api/types/openapi/common.types";

export type EvaluationStudentResult = {
  fullName: string;
  isPresent: boolean;
  overallScore: number | null;
  task: string | null;
};

export type EvaluationModuleSummary = {
  moduleName: string;
  moduleCode: string;
  averageScore: number;
};

export type EvaluationDetail = {
  title: string;
  comments: string;
  absentStudents: string[];
  studentResults: EvaluationStudentResult[];
  moduleSummary: EvaluationModuleSummary[];
};

/**
 * Type représentant une évaluation dans la liste de récupération.
 * À terme, ce type sera aligné sur le DTO retourné par GET /evaluations.
 */
export type EvaluationItem = {
  id: UUID;
  className: string;
  diplomaName: string;
  evaluationDate: string;
  studentCount: number;
  status: "completed" | "draft";
  detail: EvaluationDetail;
};
