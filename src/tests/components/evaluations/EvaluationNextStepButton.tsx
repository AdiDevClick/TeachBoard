import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";
import { useTabContentHandler } from "@/features/evaluations/create/hooks/tab-handler/useTabContentHandler";
import type { TabEvalState } from "@/features/evaluations/create/hooks/types/use-tab-content-handler.types";
import { useState } from "react";

type EvaluationNextButtonProps = Readonly<{
  name: string;
  index: number;
  showPrevious?: boolean;
}>;

export function EvaluationNextStepTestButton({
  name,
  index,
  showPrevious = true,
}: EvaluationNextButtonProps) {
  const [tabEvalState, setTabEvalState] = useState<TabEvalState>({
    slideDirection: "right",
    tabsSeen: new Set<string>(),
  });

  const { tabState } = useTabContentHandler({
    name,
    onClick: () => {},
    clickProps: {
      arrayLength: Object.keys(EvaluationPageTabsDatas).length,
      setTabValue: () => {},
      setTabEvalState,
      tabValues: Object.values(EvaluationPageTabsDatas).map((d) => d.name),
    },
    index,
    tabValue: name,
  });

  return (
    <>
      {showPrevious && (
        <button
          aria-label="Previous step"
          data-name="previous-step"
          data-tabs-seen={tabEvalState.tabsSeen.size}
          disabled={index === 0}
        />
      )}
      <button
        aria-label="Next step"
        data-name="next-step"
        disabled={tabState.isNextDisabled}
      />
    </>
  );
}
