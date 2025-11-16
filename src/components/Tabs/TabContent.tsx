import type { TabContentProps } from "@/components/Tabs/types/tabs.types.ts";
import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent.tsx";
import "@css/EvaluationPage.scss";
import { TabsContent } from "@radix-ui/react-tabs";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card.tsx";
import { Separator } from "../ui/separator.tsx";
import { useSidebar } from "../ui/sidebar.tsx";

/**
 * Tab content component for evaluation creation page.
 *
 * @param item - Data for the current tab
 * @param index - Index of the current tab
 * @param children - Right side content component
 * @param props - Additional props including onClick handler and clickProps
 */
export function TabContent({
  item,
  index,
  children,
  ...props
}: Readonly<TabContentProps>) {
  const { isMobile } = useSidebar();
  const { leftSide } = item;
  const { onClick: onClickHandler, clickProps } = props;

  return (
    <TabsContent value={item.name} className="evaluation-page-container">
      <Card className="evaluation-page__cards-container">
        <CardHeader className="cards-container__header">
          <IconArrowLeft
            onClick={(e) => onClickHandler({ e, ...clickProps, index })}
            data-name="step-previous"
          />
        </CardHeader>
        <CardContent className="cards-container__content">
          <LeftSidePageContent item={leftSide} />
          <Separator
            className="content__separator"
            orientation={isMobile ? "vertical" : "horizontal"}
          />
          {children}
        </CardContent>
        <CardFooter className="cards-container__footer">
          <IconArrowRightDashed
            {...props.functions}
            onClick={(e) => onClickHandler({ e, ...clickProps, index })}
            data-name="next-step"
          />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
