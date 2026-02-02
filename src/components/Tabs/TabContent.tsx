import {
  content,
  contentSeparator,
  evaluationPageContainer,
  evaluationPageContentContainer,
  footer,
} from "@/assets/css/EvaluationPage.module.scss";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import type {
  LeftSideProps,
  TabContentProps,
} from "@/components/Tabs/types/tabs.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { TabsContent } from "@/components/ui/tabs";
import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent";
import withTitledCard from "@components/HOCs/withTitledCard.tsx";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";
import type { MouseEvent } from "react";

/**
 * Tab content component for evaluation creation page.
 *
 * @param index - Index of the current tab
 * @param name - Name of the tab
 * @param leftSide - Data for the left side content
 * @param children - Right side content component
 * @param props - Additional props including onClick handler and clickProps
 */
export function TabContent(props: TabContentProps) {
  const {
    index,
    leftContent,
    name: tabName,
    leftSide,
    onClick: onClickHandler,
    clickProps,
  } = props;

  const { isMobile } = useSidebar();

  const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    onClickHandler({ e, ...clickProps, index });
  };

  const commonProps = {
    pageId: `step-${index}`,
    modalMode: false,
    leftSide,
    isMobile,
    leftContent,
    card: {
      title: { displayChildrenOnly: true },
      card: {
        className: evaluationPageContentContainer,
      },
      content: { className: content },
      footer: { className: footer },
    },
  };

  return (
    <TabsContent value={tabName} className={evaluationPageContainer}>
      <View {...commonProps}>
        <View.Title className="header">
          <Button
            className="left-arrow"
            onClick={clickHandler}
            data-name="step-previous"
            type="button"
            aria-label="Previous step"
          >
            <IconArrowLeft />
          </Button>
        </View.Title>
        <View.Content>{props.children}</View.Content>
        <View.Footer>
          <Button
            className="right-arrow"
            onClick={clickHandler}
            data-name="next-step"
            type="button"
            aria-label="Next step"
          >
            <IconArrowRightDashed />
          </Button>
        </View.Footer>
      </View>
    </TabsContent>
  );
}

function LeftSide(props: LeftSideProps) {
  const { leftSide, leftContent, isMobile } = props;

  return (
    <>
      <LeftSidePageContent item={leftSide}>{leftContent}</LeftSidePageContent>
      <Separator
        className={contentSeparator}
        orientation={isMobile ? "horizontal" : "vertical"}
      />
    </>
  );
}

const View = withTitledCard(LeftSide);

export const TabContentList = withListMapper(TabContent);
