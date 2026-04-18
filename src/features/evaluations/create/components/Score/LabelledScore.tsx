import {
  labelledScoreInput,
  labelledScoreInputAverage,
  labelledScoreInputBadge,
  labelledScoreInputInput,
  labelledScoreInputOriginal,
} from "@/assets/css/LabelledScoreInput.module.scss";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/components/ui/item";
import type { LabelledScoreProps } from "@/features/evaluations/create/components/Score/types/score-types";

/**
 * LabelledScore component for displaying the average score of a student with a label.
 *
 * @param item - The score item containing the student's name and their average score.
 * @param children - The content to be displayed as the score value, allowing for flexibility in how the score is rendered.
 */
export function LabelledScore({ item, children }: LabelledScoreProps) {
  return (
    <Item className={labelledScoreInput}>
      <Badge className={labelledScoreInputBadge}>{item.name}</Badge>
      <p className={labelledScoreInputOriginal}>
        {`Originale : ${item.originalScore / 5}`}
      </p>
      <p className={labelledScoreInputAverage}>{"Moyenne : "}</p>
      <div className={labelledScoreInputInput}>
        {children}
        <p>{"/20"}</p>
      </div>
    </Item>
  );
}
