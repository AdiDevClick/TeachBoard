import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent.tsx";
import "@css/EvaluationPage.scss";
import { TabsContent } from "@radix-ui/react-tabs";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card.tsx";
import { Separator } from "../ui/separator.tsx";
import { useSidebar } from "../ui/sidebar.tsx";

export function TabContent({ item, index, children, ...props }) {
  const { isMobile } = useSidebar();
  const { leftSide } = item;
  const clickProps = {
    index,
    arrayLength: props.arrayLength,
    setTabValue: props.setTabValue,
    tabValues: props.tabValues,
  };

  return (
    <TabsContent value={item.name} className="evaluation-page-container">
      <Card className="evaluation-page__cards-container">
        <CardHeader className="cards-container__header">
          <IconArrowLeft
            onClick={(e) => props.onClick({ e, ...clickProps })}
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
            onClick={(e) => props.onClick({ e, ...clickProps })}
            data-name="next-step"
          />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
