import { InpageTabs } from "@/components/InPageNavTabs/InpageTabs.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.js";
import { Tabs } from "@/components/ui/tabs";
import { StepTwo } from "@/pages/Evaluations/create/steps/two/StepTwo.js";
import type { CreateEvaluationArrowsClickHandlerProps } from "@/pages/Evaluations/create/types/create.types.js";
import type { CreateEvaluationsLoaderData } from "@/routes/routes.config.js";
import "@css/PageContent.scss";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { TabContent } from "../../../components/Tabs/TabContent.js";

const tabValues: string[] = [];

/**
 * Create Evaluations page component
 *
 * @description This component renders the Create Evaluations page with tabbed navigation.
 */
export function CreateEvaluations() {
  const { pageDatas } = useLoaderData<CreateEvaluationsLoaderData>();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState<string | undefined>(
    pageDatas?.step1.name,
  );

  /**
   * Effect to navigate to the selected tab when tabValue changes
   */
  useEffect(() => {
    navigate(tabValue?.toLocaleLowerCase() ?? "", { replace: true });
  }, [tabValue]);

  if (!pageDatas) {
    return <div>Loading...</div>;
  }

  /**
   * Props for TabContent components
   *
   * @description index needs to be passed for arrow navigation
   */
  const tabContentPropsAndFunctions = {
    onClick: handleOnArrowClick,
    clickProps: {
      arrayLength: Object.keys(pageDatas).length,
      setTabValue,
      tabValues,
    },
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
          tabValues.push(item.name);

          return (
            <TabContent
              key={key}
              item={item}
              index={index}
              {...tabContentPropsAndFunctions}
            >
              <Outlet context={StepTwo} />
            </TabContent>
          );
        }}
      </ListMapper>
    </Tabs>
  );
}

/**
 * Handle click events for tab navigation.
 *
 * @param e - Mouse event from the click
 * @param clickProps - Object containing index, arrayLength, setTabValue, and tabValues
 */
function handleOnArrowClick({
  e,
  ...clickProps
}: CreateEvaluationArrowsClickHandlerProps) {
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
