import { InpageTabs } from "@/components/InPageNavTabs/InpageTabs.tsx";
import { Tabs } from "@/components/ui/tabs";
import "@css/PageContent.scss";
import { useState, type MouseEvent } from "react";
import { useLoaderData } from "react-router-dom";
import { TabContent } from "../../../components/Tabs/TabContent.js";

const tabValues: string[] = [];

export function CreateEvaluations() {
  const { pageDatas } = useLoaderData();
  const [tabValue, setTabValue] = useState<string | undefined>(
    pageDatas.step1.tabTitle
  );

  const tabContentProps = {
    arrayLength: Object.keys(pageDatas).length,
    handleOnClick,
    setTabValue,
    tabValues,
  };

  return (
    // <div className="flex w-full flex-col gap-6 h-full page__content-container">
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
      {Object.entries(pageDatas).map(([key, item], index) => {
        tabValues.push(extractTabValues(item));
        return (
          <TabContent key={key} item={item} index={index} {...tabContentProps}>
            {item.rightSide.content && <item.rightSide.content />}
          </TabContent>
        );
      })}
    </Tabs>
    // </div>
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
function handleOnClick<T extends Record<string, unknown>>({
  e,
  clickProps,
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

function extractTabValues(item: { tabTitle: string }) {
  return item.tabTitle;
}
