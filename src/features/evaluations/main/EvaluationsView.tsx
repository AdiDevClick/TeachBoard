import withTitledCard from "@/components/HOCs/withTitledCard";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { STEP_FOUR_INPUT_CONTROLLERS } from "@/features/evaluations/create/steps/four/config/step-four.configs";
import { EvaluationsViewController } from "@/features/evaluations/main/controllers/EvaluationsViewController";
import { useEvaluationsViewFetch } from "@/features/evaluations/main/hooks/useEvaluationsViewFetch";
import type { EvaluationsViewProps } from "@/features/evaluations/main/types/evaluations.types";
import { cn } from "@/utils/utils";
import { type ComponentProps } from "react";

/**
 * EvaluationsView component that displays the details of an evaluation, including modules, student scores, and comments.
 */
export function EvaluationsView({
  evalEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
  evalDataReshapeFn = API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  classEndpoint = API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID,
  classDataReshapeFn = API_ENDPOINTS.GET.CLASSES.dataReshapeSingle,
  pageId = "evaluation-overview",
  classTask = "evaluation-class-selection",
  inputControllers = STEP_FOUR_INPUT_CONTROLLERS,
  modalMode = false,
  className = "grid gap-6",
}: EvaluationsViewProps) {
  // Fetch Class + Evaluation datas
  const { evaluationData, classData, selectedClassDatasMemo } =
    useEvaluationsViewFetch({
      pageId,
      evalEndpoint,
      evalDataReshapeFn,
      classEndpoint,
      classDataReshapeFn,
      classTask,
    });

  const cardProps = {
    pageId,
    evalEndpoint,
    evalDataReshapeFn,
    inputControllers,
    modalMode,
    evaluationData,
    classData,
    selectedClass: selectedClassDatasMemo?.selectedClass,
    className,
    card: {
      card: {
        className: cn(
          className,
          "w-full max-w-[850px] mx-auto border-none bg-transparent shadow-none",
        ),
      },
      title: {
        title: "",
        description: "Details de l'évaluation",
        separator: { displaySeparator: true },
      },
      content: {
        className,
      },
    },
  } satisfies ComponentProps<typeof Card>;

  return (
    <Card {...cardProps}>
      <Card.Title />
      <Card.Content />
    </Card>
  );
}

const Card = withTitledCard(EvaluationsViewController);
