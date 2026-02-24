import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DegreeModule } from "@/features/class-creation";
import { degreeModuleCreationInputControllers } from "@/features/class-creation/components/DegreeModule/forms/degree-module-inputs";
import { DEGREE_MODULE_SKILL_CARD_TITLE } from "@/features/class-creation/components/DegreeModuleSkill/config/degree-module-skill.configs";
import { degreeSubSkillsCreationInputControllers } from "@/features/class-creation/components/DegreeModuleSkill/forms/degree-module-skill-inputs";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import {
  skillCreated,
  skillFetched,
} from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  assertPostUpdatedCacheWithoutExtraGet,
  waitForCache,
} from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  fillFieldsEnsuringSubmitDisabled,
  queryKeyFor,
  rx,
  stubFetchRoutes,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions";
import { afterEach, describe, expect, test, vi } from "vitest";

const skillsController = degreeModuleCreationInputControllers.find(
  (c) => c.name === "skillList",
)!;
const skillQueryKey = queryKeyFor(skillsController);

setupUiTestState(
  <AppTestWrapper>
    <DegreeModule modalMode={false} />
    <AppModals />
  </AppTestWrapper>,
  {
    beforeEach: () =>
      stubFetchRoutes({
        getRoutes: [["/api/skills/sub", { Skills: [skillFetched] }]],
        postRoutes: [["/api/skills/sub", skillCreated]],
      }),
  },
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DegreeModuleSkill modal UI interaction", () => {
  test("clicking add new opens modal, form validates and POST updates cache and command list", async () => {
    // Open popover (command list) and assert it contains fetched skills
    await openModalAndAssertItsOpenedAndReady(
      skillsController.creationButtonText,
      {
        controller: skillsController,
        nameArray: [skillFetched.code],
        readyText: DEGREE_MODULE_SKILL_CARD_TITLE.title,
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      skillsController.apiEndpoint,
      "GET",
    );

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
    await waitForDialogAndAssertText(DEGREE_MODULE_SKILL_CARD_TITLE.title, {
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
