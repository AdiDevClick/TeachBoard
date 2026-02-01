import type { CreateEvaluationArrowsClickHandlerProps } from "@/features/evaluations/create/types/create.types.ts";
import type { CreateEvaluationsLoaderData } from "@/routes/routes.config.tsx";
import type { PropsWithChildren, ReactNode } from "react";

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
    leftContent?: ReactNode;
  } & PropsWithChildren
>;

/**
 * Types for LeftSide component props
 */
export type LeftSideProps = Readonly<{
  leftSide: TabContentProps["leftSide"];
  leftContent?: ReactNode;
  isMobile: boolean;
}>;
