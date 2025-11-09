import { InpageTabs } from "@/components/InPageNavTabs/InpageTabs.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.js";
import { Tabs } from "@/components/ui/tabs";
import { RightSidePageContent } from "@/pages/Evaluations/create/right-content/RightSidePageContent.js";
import type { CreateEvaluationsLoaderData } from "@/routes/routes.config.js";
import "@css/PageContent.scss";
import { useState, type MouseEvent } from "react";
import { useLoaderData } from "react-router-dom";
import { TabContent } from "../../../components/Tabs/TabContent.js";

const tabValues: string[] = [];

/**
 * Create Evaluations page component
 *
 * @description This component renders the Create Evaluations page with tabbed navigation.
 */
export function CreateEvaluations() {
  const { pageDatas } = useLoaderData<CreateEvaluationsLoaderData>();

  const [tabValue, setTabValue] = useState<string | undefined>(
    pageDatas?.step1.name
  );

  if (!pageDatas) {
    return <div>Loading...</div>;
  }

  /**
   * Props for TabContent components
   */
  const tabContentProps = {
    arrayLength: Object.keys(pageDatas).length,
    onClick: handleOnArrowClick,
    setTabValue,
    tabValues,
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={setTabValue}
      className="page__content-container"
    >
      <InpageTabs
        datas={pageDatas}
        value={tabValue}
        onValueChange={setTabValue}
      />
      <ListMapper items={pageDatas}>
        {([key, item], index) => {
          tabValues.push(extractTabValues(item));

          return (
            <TabContent
              key={key}
              item={item}
              index={index}
              {...tabContentProps}
            >
              <RightSidePageContent item={item.rightSide} />
            </TabContent>
          );
        }}
      </ListMapper>
    </Tabs>
  );
}
type handleOnClickProps<T> = {
  e: MouseEvent<SVGElement>;
  clickProps: T;
};

/**
 * Handle click events for tab navigation.
 *
 * @param e - Mouse event from the click
 * @param clickProps - Object containing index, arrayLength, setTabValue, and tabValues
 */
function handleOnArrowClick<T extends Record<string, unknown>>({
  e,
  ...clickProps
}: handleOnClickProps<T>) {
  e.preventDefault();
  const { index, arrayLength, setTabValue, tabValues } = clickProps;
  let newIndex = 0;

  const currentStep = e.currentTarget.dataset.name;
  const isPreviousAllowed = index > 0;
  const isNextAllowed = index < arrayLength - 1;

  if (currentStep === "step-previous" && isPreviousAllowed) {
    newIndex = index - 1;
  }

  if (currentStep === "next-step" && isNextAllowed) {
    newIndex = index + 1;
  }

  if (newIndex === 0 && (!isPreviousAllowed || !isNextAllowed)) return;

  setTabValue(tabValues[newIndex]);
}

function extractTabValues(item: { name: string }) {
  return item.name;
}
