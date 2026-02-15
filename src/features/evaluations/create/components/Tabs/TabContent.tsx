import {
  contentSeparator,
  evaluationPageContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { TAB_CONTENT_VIEW_CARD_PROPS } from "@/features/evaluations/create/components/Tabs/config/tab-content.configs";
import type {
  LeftSideProps,
  TabContentProps,
} from "@/features/evaluations/create/components/Tabs/types/tabs.types";
import { useTabContentHandler } from "@/features/evaluations/create/hooks/useTabContentHandler";
import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent";
import { createComponentName } from "@/utils/utils";
import withTitledCard from "@components/HOCs/withTitledCard.tsx";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";

const BUTTON_LEFT = {
  "data-name": "step-previous",
  "aria-label": "Previous step",
  className: "left-arrow",
} as const;

const BUTTON_RIGHT = {
  "data-name": "next-step",
  "aria-label": "Next step",
  className: "right-arrow",
} as const;

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
    onClick,
    clickProps,
  } = props;
  const { clickHandler, tabState, isMobile } = useTabContentHandler({
    name: tabName,
    clickProps,
    onClick,
    index,
  });

  const id = `tab-content-${index}`;

  const commonProps = {
    pageId: `step-${index}`,
    modalMode: false,
    leftSide,
    isMobile,
    leftContent,
    card: TAB_CONTENT_VIEW_CARD_PROPS,
  };

  const commonButtonProps = {
    onClick: clickHandler,
    type: "button",
  } as const;

  return (
    <TabsContent
      id={id}
      value={tabName}
      className={evaluationPageContainer}
    >
      <View {...commonProps}>
        <View.Title className="header">
          {index !== 0 && (
            <Button {...commonButtonProps} {...BUTTON_LEFT}>
              <IconArrowLeft />
            </Button>
          )}
        </View.Title>
        <View.Content>{props.children}</View.Content>
        <View.Footer>
          {index !== props.clickProps.arrayLength - 1 && (
            <Button
              {...commonButtonProps}
              {...BUTTON_RIGHT}
              disabled={tabState.isNextDisabled}
            >
              <IconArrowRightDashed />
            </Button>
          )}
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
createComponentName("withTitledCard", "View", View);
