import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import type { ModulesSelectionType } from "@/features/evaluations/create/store/types/steps-creation-store.types";
import type { CreateEvaluationArrowsClickHandlerProps } from "@/features/evaluations/create/types/create.types.ts";
import type { CreateEvaluationsLoaderData } from "@/routes/types/routes-config.types";
import type { JSX, PropsWithChildren } from "react";

type PageDataItem = keyof NonNullable<CreateEvaluationsLoaderData["pageDatas"]>;

type PageData = NonNullable<
  CreateEvaluationsLoaderData["pageDatas"]
>[PageDataItem];

/**
 * Types for TabContent component props
 */
export type TabContentProps = Readonly<
  Pick<PageData, "name" | "leftSide"> & {
    index: number;
    onClick: (arg: CreateEvaluationArrowsClickHandlerProps) => void;
    clickProps: Omit<CreateEvaluationArrowsClickHandlerProps, "e" | "index">;
    leftContent: JSX.Element | null;
  } & PropsWithChildren
>;

/**
 * Types for LeftSide component props
 */
export type LeftSideProps = Readonly<
  {
    leftSide: TabContentProps["leftSide"];
    pageId: string;
    isMobile: boolean;
  } & Pick<ModulesSelectionType, "isClicked">
>;

/**
 * Types for the triggerButtonInteractivity function arguments
 */
export type TriggerButtonInteractivityArgs = {
  tabName: string;
  selectedClass?: ClassSummaryDto;
  areAllModulesCompleted: boolean;
  moduleSelectionState: ModulesSelectionType;
  areStudentsWithAssignedTask: boolean;
};
