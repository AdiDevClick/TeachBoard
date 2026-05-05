import withListMapper from "@/components/HOCs/withListMapper";
import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { Badge } from "@/components/ui/badge";
import { DrawerContent } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { EvaluationDetailDrawerButton } from "@/features/evaluations/main/components/drawer-button/EvaluationDetailDrawerButton";
import { buttonsData } from "@/features/evaluations/main/configs/evaluation-detail-drawer-buttons.configs";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { usePageTitle } from "@/hooks/usePageTitle";
import { createDrawerDisplayDate } from "@/utils/utils";
import { type ComponentProps, type PropsWithChildren } from "react";

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
          {evaluations.map((studentEval, index) => (
            <li
              key={`results-${studentEval.id}-${index}`}
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
              {absentStudents.map((student, index) => (
                <Badge
                  key={`student-${student.id}-${index}`}
                  variant="outline"
                  className="mr-1 mb-1"
                >
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
            {`Créée le ${createDrawerDisplayDate(createdAt)} \n`}
          </p>
        )}
        {updatedAt && (
          <p className="text-muted-foreground text-xs italic">
            {`Dernière mise à jour le ${createDrawerDisplayDate(updatedAt)}`}
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
  usePageTitle(evaluation?.title);

  const drawerProps = {
    drawerContentProps: props,
    drawerHeader: {
      drawerTitle: { label: evaluation?.title ?? "Détail de l'évaluation" },
      drawerDescription: { label: `— ${evaluation?.className}` },
    },
    drawerFooter: { drawerClose: { label: "Fermer" } },
    drawerContent: {
      evaluation: evaluation ?? undefined,
      ...props,
    },
    open: evaluation !== null,
    onClose,
  } satisfies ComponentProps<typeof EvaluationDrawer>;

  return (
    <EvaluationDrawer {...drawerProps}>
      <EvaluationDrawer.Header />
      {evaluation && <EvaluationDrawer.Content />}
      <EvaluationDrawer.Footer>
        <ButtonsGroup
          items={buttonsData}
          optional={(button) => ({
            to: button.getLink(evaluation?.id ?? ""),
          })}
        />
      </EvaluationDrawer.Footer>
    </EvaluationDrawer>
  );
}
const EvaluationDrawer = withVerticalDrawer(DetailContent);
const ButtonsGroup = withListMapper(EvaluationDetailDrawerButton);
