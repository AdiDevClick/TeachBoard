import { degreeModuleTitleProps } from "@/components/ClassCreation/diploma/degree-module-skill/DegreeModuleSkill.tsx";
import { DegreeModuleController } from "@/components/ClassCreation/diploma/degree-module/controller/DegreeModuleController";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  degreeModuleCreationInputControllers,
  degreeSubSkillsCreationInputControllers,
} from "@/data/inputs-controllers.data";
import type { DegreeModuleFormSchema } from "@/models/degree-module.models";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import {
  skillCreated,
  skillFetched,
  stubFetchWithItems,
} from "@/tests/samples/command-handler-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  assertPostUpdatedCacheWithoutExtraGet,
  waitForCache,
} from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCalls,
  fillFieldsEnsuringSubmitDisabled,
  openPopoverAndExpectByTrigger,
  queryKeyFor,
  rx,
  submitButtonShouldBeDisabled,
  waitForDialogAndAssertText,
  waitForDialogState,
} from "@/tests/test-utils/vitest-browser.helpers";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
// Render the controller wrapped in a small component that creates the form (hooks must be used in components)
function DegreeModuleControllerWrapper() {
  const form = useForm<DegreeModuleFormSchema>({
    defaultValues: { name: "", code: "", skillList: [] },
  });
  return (
    <DegreeModuleController
      formId="degree-module-form"
      pageId="new-degree-module"
      form={form}
    />
  );
}

const skillsController = degreeModuleCreationInputControllers.find(
  (c) => c.name === "skillList"
)!;
const skillQueryKey = queryKeyFor(skillsController);

setupUiTestState(
  <AppTestWrapper>
    <DegreeModuleControllerWrapper />
    <AppModals />
  </AppTestWrapper>,
  { beforeEach: stubFetchWithItems }
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DegreeModuleSkill modal UI interaction", () => {
  test("clicking add new opens modal, form validates and POST updates cache and command list", async () => {
    // Open popover (command list) and assert it contains fetched skills
    await openPopoverAndExpectByTrigger(rx(skillsController.placeholder), [
      skillFetched.code,
    ]);

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCalls("GET");

    // Click "Add new" inside popover to open the skill creation modal
    await userEvent.click(
      page.getByRole("button", {
        name: rx(skillsController.creationButtonText),
      })
    );

    // Ensure modal is opened
    await waitForDialogState(true, 1000);

    // Validation: submit should be disabled while form is invalid
    await submitButtonShouldBeDisabled("Ajouter");

    // Match the stubbed POST payload/response shape
    const fills = [
      {
        label: rx(degreeSubSkillsCreationInputControllers[0].title),
        value: "new",
      },
      {
        label: rx(degreeSubSkillsCreationInputControllers[1].title),
        value: "NEW",
      },
    ];

    await fillFieldsEnsuringSubmitDisabled("Ajouter", fills);
    // Last tab blurs the final field so RHF (onTouched) can compute validity

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Ajouter");

    // Modal closes on success — assert dialog closed and title absent
    await waitForDialogAndAssertText(degreeModuleTitleProps.title, {
      present: false,
    });

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: skillQueryKey,
      expectedValue: skillCreated.code,
      getCallsBefore: getCallsBeforeCreation,
      endpoint: skillsController.apiEndpoint,
      openPopover: { trigger: rx(skillsController.placeholder) },
      post: {
        endpoint: API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL,
        count: 1,
        timeout: 2500,
      },
    });

    // Additional strict assertion: check full cache shape
    const cached = await waitForCache(skillQueryKey);
    expect(cached).toEqual([
      {
        groupTitle: "Tous",
        items: expect.arrayContaining([
          expect.objectContaining(skillFetched),
          expect.objectContaining(skillCreated),
        ]),
      },
    ]);
  });
});
