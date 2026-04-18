import type { UUID } from "@/api/types/openapi/common.types";
import type { DynamicItemTuple } from "@/components/Tags/types/tags.types";
import type { ScoreItem } from "@/features/evaluations/create/components/Score/types/score-types";
import { calculateStudentOverallScore } from "@/features/evaluations/create/store/functions/evaluation-store.functions";
import { evaluationContainsSubSkill } from "@/features/evaluations/main/hooks/functions/use-evaluations-view.functions";
import type { UseEvaluationsViewProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view.types";
import { useMemo } from "react";

/**
 * Hook containing the logic for the EvaluationsView component
 *
 * @description Responsible for fetching and processing evaluation data based on the ID from the URL
 */
export function useEvaluationsView({
  evaluationData,
}: UseEvaluationsViewProps) {
  /**
   * Generates a list of absent students names to display.
   */
  const presence = useMemo(() => {
    const absents = evaluationData?.absentStudents ?? [];
    let students: DynamicItemTuple[] = [["Aucun", { id: "none" }]];

    if (absents.length > 0) {
      students = absents.map((student) => [student.name, { id: student.id }]);
    }

    return {
      students,
    };
  }, [evaluationData]);

  /**
   * Generates a list of students with their average scores for each module, based on the evaluation data.
   */
  const studentsAverageScores = useMemo(() => {
    const scores: Array<readonly [UUID, ScoreItem]> = [];

    if (!evaluationData) {
      return scores;
    }

    return evaluationData.evaluations.map((student) => {
      const originalScore = calculateStudentOverallScore(student.modules);

      return [
        student.id,
        {
          name: student.name,
          score: student.overallScore ?? 0,
          originalScore,
        },
      ];
    });
  }, [evaluationData]);

  /**
   * Retrieves the list of sub-skills for a given module and the corresponding student information, based on the evaluation data.
   */
  const getStudentSubskillsForModule = (subskillId: UUID, moduleId: UUID) => {
    const evaluations = evaluationData?.evaluations ?? [];

    const students = evaluations.filter((evaluation) =>
      evaluationContainsSubSkill(evaluation, subskillId, moduleId),
    );

    return students.map((student) => ({
      ...student,
      fullName: student.name,
    }));
  };

  /**
   * Generates a list of modules with their corresponding sub-skills and student evaluations, based on the evaluation data.
   */
  const modules = useMemo(() => {
    return (evaluationData?.attendedModules ?? []).map((module) => ({
      ...module,
      value: module.name,
    }));
  }, [evaluationData]);

  const scoreValue = (studentId: UUID, subSkillId: UUID, moduleId: UUID) => {
    if (!subSkillId || !moduleId) return [0];

    const subSkill = evaluationData?.evaluations
      .find((evaluated) => evaluated.id === studentId)
      ?.modules.find((module) => module.id === moduleId)
      ?.subSkills?.find((subSkill) => subSkill.id === subSkillId);

    return [subSkill?.score ?? 0];
  };

  return {
    scoreValue,
    studentsAverageScores,
    modules,
    getStudentSubskillsForModule,
    presence,
  };
}
