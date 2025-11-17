import type { CreateEvaluationArrowsClickHandlerProps } from "@/pages/Evaluations/create/types/create.types.ts";
import type { CreateEvaluationsLoaderData } from "@/routes/routes.config.tsx";
import type { ReactNode } from "react";

type PageDataItem = keyof NonNullable<CreateEvaluationsLoaderData["pageDatas"]>;

type PageData = NonNullable<
  CreateEvaluationsLoaderData["pageDatas"]
>[PageDataItem];

/**
 * Types for TabContent component props
 */
export type TabContentProps = {
  item: PageData;
  index: number;
  children: ReactNode;
  onClick: (arg: CreateEvaluationArrowsClickHandlerProps) => void;
  clickProps: Omit<CreateEvaluationArrowsClickHandlerProps, "e" | "index">;
};
