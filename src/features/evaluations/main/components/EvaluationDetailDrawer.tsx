import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import type {
  EvaluationDetail,
  EvaluationItem,
} from "@/features/evaluations/main/types/evaluations-listing.types";
import { useIsMobile } from "@/hooks/use-mobile";

const LONG_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

type EvaluationDetailDrawerProps = Readonly<{
  evaluation: EvaluationItem | null;
  onClose: () => void;
}>;

function getScoreColor(score: number) {
  if (score >= 14) return "text-green-600 dark:text-green-400";
  if (score >= 10) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function ScoreDisplay({ score }: Readonly<{ score: number }>) {
  return (
    <span className={`tabular-nums font-semibold ${getScoreColor(score)}`}>
      {score.toFixed(1)}
      <span className="ml-0.5 text-xs font-normal text-muted-foreground">
        /20
      </span>
    </span>
  );
}

function DetailContent({ detail }: Readonly<{ detail: EvaluationDetail }>) {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto px-4 py-2 text-sm">
      {/* Modules */}
      <section>
        <h3 className="mb-2 font-semibold">Compétences évaluées</h3>
        <ul className="flex flex-col gap-2">
          {detail.moduleSummary.map((mod) => (
            <li
              key={mod.moduleCode}
              className="flex items-center justify-between"
            >
              <span>
                <span className="font-medium">{mod.moduleName}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({mod.moduleCode})
                </span>
              </span>
              <ScoreDisplay score={mod.averageScore} />
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      {/* Students */}
      <section>
        <h3 className="mb-2 font-semibold">Résultats des élèves</h3>
        <ul className="flex flex-col gap-1.5">
          {detail.studentResults.map((student) => (
            <li
              key={student.fullName}
              className="flex items-center justify-between rounded-md p-1.5 even:bg-muted/40"
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant={student.isPresent ? "default" : "outline"}
                  className="px-1.5 text-xs"
                >
                  {student.isPresent ? "Présent" : "Absent"}
                </Badge>
                <span>{student.fullName}</span>
                {student.task && (
                  <span className="text-xs text-muted-foreground">
                    — {student.task}
                  </span>
                )}
              </div>
              {student.isPresent && student.overallScore !== null ? (
                <ScoreDisplay score={student.overallScore} />
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Comments */}
      {detail.comments && (
        <>
          <Separator />
          <section>
            <h3 className="mb-1 font-semibold">Commentaires</h3>
            <p className="text-muted-foreground">{detail.comments}</p>
          </section>
        </>
      )}
    </div>
  );
}

export function EvaluationDetailDrawer({
  evaluation,
  onClose,
}: EvaluationDetailDrawerProps) {
  const isMobile = useIsMobile();

  const dateLabel = evaluation
    ? new Date(evaluation.evaluationDate).toLocaleDateString(
        "fr-FR",
        LONG_DATE_FORMAT,
      )
    : "";

  return (
    <Drawer
      open={evaluation !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>
            {evaluation?.detail.title ?? "Détail de l'évaluation"}
          </DrawerTitle>
          <DrawerDescription>
            {dateLabel}
            {evaluation && (
              <span className="ml-2 text-muted-foreground">
                — {evaluation.className}
              </span>
            )}
          </DrawerDescription>
        </DrawerHeader>

        {evaluation && <DetailContent detail={evaluation.detail} />}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
