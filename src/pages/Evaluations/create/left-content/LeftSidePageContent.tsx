import { CardDescription, CardTitle } from "@/components/ui/card.tsx";
import type { LeftContentProps } from "@/pages/Evaluations/create/types/create.types.ts";
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
  const { item } = props;
  return (
    <div className="content__left">
      <CardTitle className="content__left--number">{item.number}.</CardTitle>
      <CardTitle className="content__left--title">{item.title}</CardTitle>
      <Activity mode={props.children ? "hidden" : "visible"}>
        <CardDescription className="content__left--description">
          {item.description}
        </CardDescription>
      </Activity>
      <Activity mode={props.children ? "visible" : "hidden"}>
        {props.children}
      </Activity>
    </div>
  );
}
