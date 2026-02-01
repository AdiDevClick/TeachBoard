import {
  contentLeft,
  contentLeftDescription,
  contentLeftNumber,
  contentLeftTitle,
} from "@/assets/css/EvaluationPage.module.scss";
import { CardDescription, CardTitle } from "@/components/ui/card.tsx";
import {
  debugLogs,
  leftSidePageContentPropsInvalid,
} from "@/configs/app-components.config.ts";
import type { LeftContentProps } from "@/features/evaluations/create/types/create.types.ts";
import { Activity } from "react";

/**
 * Left content component for evaluation creation page.
 *
 * @description Displays the number, title, and description of the item.
 *
 * @remarks If children are provided, the description is hidden and children are rendered instead.
 *
 * @param item - Data for the left content including number, title, and description
 * @param children - Optional children components to render instead of description
 */
export function LeftSidePageContent(props: Readonly<LeftContentProps>) {
  if (leftSidePageContentPropsInvalid(props)) {
    debugLogs("LeftSidePageContent", props);
    // Deliberately continue with default values
  }

  const {
    item: { number = 0, title = "Page-Title", description = "Description" },
  } = props;

  return (
    <div className={contentLeft}>
      <CardTitle className={contentLeftNumber}>{number}.</CardTitle>
      <CardTitle className={contentLeftTitle}>{title}</CardTitle>
      <Activity mode={props.children ? "hidden" : "visible"}>
        <CardDescription className={contentLeftDescription}>
          {description}
        </CardDescription>
      </Activity>
      <Activity mode={props.children ? "visible" : "hidden"}>
        {props.children}
      </Activity>
    </div>
  );
}
