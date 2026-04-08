import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import type { useEvaluationsEditFetch } from "@/features/evaluations/edit/hooks/useEvaluationsEditFetch";

export type UseEvaluationsHydrationProps = Readonly<
  Pick<ReturnType<typeof useEvaluationsEditFetch>, "evaluationData"> & {
    selectedClass?: ClassSummaryDto;
  }
>;
