import { CardDescription, CardTitle } from "@/components/ui/card.tsx";
import type { LeftContentProps } from "@/pages/Evaluations/create/types/create.types.ts";

/**
 * Left content component for evaluation creation page.
 *
 * @description Displays the number, title, and description of the item.
 *
 * @param item
 */
export function LeftSidePageContent({ item }: Readonly<LeftContentProps>) {
  return (
    <div className="content__left">
      <CardTitle className="content__left--number">{item.number}.</CardTitle>
      <CardTitle className="content__left--title">{item.title}</CardTitle>
      <CardDescription className="content__left--description">
        {item.description}
      </CardDescription>
    </div>
  );
}
