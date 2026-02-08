import { InpageTabs } from "@/components/InPageNavTabs/InpageTabs.tsx";
import { TabContentList } from "@/components/Tabs/TabContent";
import { Tabs } from "@/components/ui/tabs";
import type { CreateEvaluationArrowsClickHandlerProps } from "@/features/evaluations/create/types/create.types";
import type { CreateEvaluationsLoaderData } from "@/routes/types/routes-config.types";
import "@css/PageContent.scss";
import { useEffect, useEffectEvent, useState, type JSX } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";

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

  const [leftContent, setLeftContent] = useState<JSX.Element | null>(null);

  const trigerNavigation = useEffectEvent((tabValue: string | undefined) => {
    navigate(tabValue?.toLocaleLowerCase() ?? "", { replace: true });
  });

  /**
   * Effect to navigate to the selected tab when tabValue changes
   */
  useEffect(() => {
    trigerNavigation(tabValue);
  }, [tabValue]);

  if (!pageDatas) {
    return <div>Loading...</div>;
  }

  /**
   * Props for TabContent components
   *
   * @description index needs to be passed for arrow navigation
   *
   * @remarks This also contains leftContent state to be passed to each TabContent
   */
  const tabContentPropsAndFunctions = {
    onClick: handleOnArrowClick,
    clickProps: {
      arrayLength: Object.keys(pageDatas).length,
      setTabValue,
      tabValues,
    },
    leftContent,
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
      <TabContentList
        items={Object.values(pageDatas)}
        optional={(item) => {
          tabValues.push(item.name);

          return { ...tabContentPropsAndFunctions };
        }}
      >
        <Outlet context={[leftContent, setLeftContent]} />
      </TabContentList>
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
