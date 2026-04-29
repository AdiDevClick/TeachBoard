import withListMapper from "@/components/HOCs/withListMapper";
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
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationDetailDrawerButton } from "@/features/evaluations/main/components/drawer-button/EvaluationDetailDrawerButton";
import { useEvaluationsViewFetch } from "@/features/evaluations/main/hooks/useEvaluationsViewFetch";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePageTitle } from "@/hooks/usePageTitle";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import {
  useState,
  type AnimationEvent,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import { useNavigate } from "react-router-dom";
import { buttonsData } from "../../configs/evaluation-detail-drawer-buttons.configs";

type EvaluationDetailDrawerProps = Readonly<
  {
    evaluation: DetailedEvaluationView | null;
    onClose: () => void;
  } & Omit<ComponentProps<typeof DrawerContent>, "children">
>;

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

type DetailContentProps = Readonly<{
  evaluation: DetailedEvaluationView;
}>;

function DetailContent({ evaluation }: DetailContentProps) {
  const { evaluations, comments, absentStudents, updatedAt, createdAt } =
    evaluation;
  return (
    <div className="flex flex-col gap-6 overflow-y-auto px-4 py-2 text-sm">
      <Separator />

      {/* Student evaluations */}
      <DrawerSection title="Résultats des élèves">
        <ul className="grid gap-1.5">
          {evaluations.map((studentEval) => (
            <li
              key={studentEval.id}
              className="flex items-center justify-between rounded-md p-1.5 even:bg-muted/40"
            >
              <div className="grid items-center gap-2">
                <p>{studentEval.name}</p>
                <p className="text-xs text-muted-foreground">
                  — {studentEval.assignedTask.name}
                </p>
              </div>
              {studentEval.isPresent && studentEval.overallScore !== null ? (
                <ScoreDisplay score={studentEval.overallScore / 5} />
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </li>
          ))}
        </ul>
      </DrawerSection>

      {absentStudents && (
        <>
          <Separator />
          <DrawerSection title="Absents">
            <p className="text-muted-foreground">
              {absentStudents.map((student) => (
                <Badge key={student.id} variant="outline" className="mr-1 mb-1">
                  {student.name}
                </Badge>
              ))}
            </p>
          </DrawerSection>
        </>
      )}

      {comments && (
        <>
          <Separator />
          <DrawerSection title="Commentaires">
            <p className="text-muted-foreground">{comments}</p>
          </DrawerSection>
        </>
      )}

      {createdAt || updatedAt ? <Separator /> : null}

      <DrawerSection title="Infos">
        {createdAt && (
          <p className="text-muted-foreground text-xs italic">
            {`Créée le ${new Date(createdAt).toLocaleString("fr-FR").replace(" ", " à ").split(":").slice(0, 2).join(":")} \n`}
          </p>
        )}
        {updatedAt && (
          <p className="text-muted-foreground text-xs italic">
            {`Dernière mise à jour le ${new Date(updatedAt).toLocaleString("fr-FR").replace(" ", " à ").split(":").slice(0, 2).join(":")}`}
          </p>
        )}
      </DrawerSection>
    </div>
  );
}

type DrawerSectionProps = Readonly<
  {
    title: string;
  } & PropsWithChildren
>;

function DrawerSection({ title, children }: DrawerSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  );
}

// buttonsData is imported from evaluation-detail-buttons.data

export function EvaluationDetailDrawer({
  evaluation,
  onClose,
  ...props
}: EvaluationDetailDrawerProps) {
  const isMobile = useIsMobile();
  usePageTitle(evaluation?.title);

  return (
    <Drawer
      open={evaluation !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent {...props}>
        <DrawerHeader className="gap-1">
          <DrawerTitle>
            {evaluation?.title ?? "Détail de l'évaluation"}
          </DrawerTitle>
          <DrawerDescription
            id="evaluation-detail-description"
            className="ml-2 text-muted-foreground"
          >
            {`— ${evaluation?.className}`}
          </DrawerDescription>
        </DrawerHeader>

        {evaluation && <DetailContent evaluation={evaluation} />}

        <DrawerFooter>
          <ButtonsGroup
            items={buttonsData}
            optional={(button) => ({
              to: button.getLink(evaluation?.id ?? ""),
            })}
          />
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const ButtonsGroup = withListMapper(EvaluationDetailDrawerButton);

export function EvaluationDetailDrawerRoute() {
  const [open, setOpen] = useState(true);
  const { evaluationData } = useEvaluationsViewFetch({
    task: "evaluation-summary",
    endpoint: API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
    reshapeFn: API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  });
  const navigate = useNavigate();

  const waitAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    preventDefaultAndStopPropagation(e);
    if (!open) navigate("..");
  };

  const evaluation = open ? (evaluationData ?? null) : null;

  return (
    <EvaluationDetailDrawer
      evaluation={evaluation}
      onClose={() => setOpen(false)}
      onAnimationEnd={waitAnimationEnd}
    />
  );
}
