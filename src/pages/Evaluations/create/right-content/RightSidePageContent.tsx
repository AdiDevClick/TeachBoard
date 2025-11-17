import type { RightContentProps } from "@/pages/Evaluations/create/types/create.types.ts";

/**
 * Right content component for evaluation creation page.
 * @description Renders the dynamic content component if provided.
 *
 * @param item
 */
export function RightSidePageContent({ item }: Readonly<RightContentProps>) {
  const Content = item?.content;
  return Content ? <Content /> : null;
}
