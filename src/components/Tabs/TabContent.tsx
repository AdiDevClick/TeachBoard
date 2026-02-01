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
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { TabsContent } from "@/components/ui/tabs";
import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent";
import withTitledCard from "@components/HOCs/withTitledCard.tsx";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";

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
  // DEBUG: inspect style keys exported by the module (temporary)
  const clickHandler = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
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
      <TabView {...commonProps}>
        <TabView.Title>
          <IconArrowLeft onClick={clickHandler} data-name="step-previous" />
        </TabView.Title>
        <TabView.Content>{props.children}</TabView.Content>
        <TabView.Footer>
          <IconArrowRightDashed onClick={clickHandler} data-name="next-step" />
        </TabView.Footer>
      </TabView>
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

const TabView = withTitledCard(LeftSide);

export const TabContentList = withListMapper(TabContent);
