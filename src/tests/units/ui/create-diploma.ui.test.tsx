import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { diplomaFetchedSkills } from "@/tests/samples/class-creation-sample-datas";
import { fixtureCreateDiplomaFromClassCreation } from "@/tests/samples/ui-fixtures/class-creation.ui.fixtures";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { assertPostUpdatedCacheWithoutExtraGet } from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  getLastPostJsonBodyByUrl,
  getOpenCommandContainer,
  openPopoverAndExpectByTrigger,
  openPopoverByTriggerName,
  queryKeyFor,
  rx,
  rxJoin,
  selectCommandItemInContainerEnsuringSubmitDisabled,
  selectMultiplePopoversEnsuringSubmitDisabled,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

import { AppModals } from "@/pages/AllModals/AppModals.tsx";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation/regex.functions";
import {
  clickTriggerAndWaitForPopoverState,
  openModalAndAssertItsOpenedAndReady,
} from "@/tests/units/ui/functions/useful-ui.functions";

const fx = fixtureCreateDiplomaFromClassCreation();
const {
  diplomasController,
  diplomaFieldController,
  diplomaYearController,
  diplomaLevelController,
  diplomaModuleController,
} = fx.controllers;
const diplomasQueryKey = queryKeyFor(diplomasController);
const labeled = {
  controller: diplomasController,
  nameArray: [
    rxJoin(
      fx.sample.diplomaFetched.degreeLevel,
      fx.sample.diplomaFetched.degreeYear
    ),
    rxJoin(
      fx.sample.diplomaFetched2.degreeLevel,
      fx.sample.diplomaFetched2.degreeYear
    ),
  ],
};

setupUiTestState(
  <AppTestWrapper>
    <AppModals />
    <SamplePopoverInput
      pageId="class-creation"
      controller={diplomasController}
    />
  </AppTestWrapper>,
  { beforeEach: fx.installFetchStubs }
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: create-diploma (from class-creation)", () => {
  test("selections validate, POST updates cache, and class-creation list updates without extra GET", async () => {
    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(
      diplomasController.creationButtonText,
      {
        controller: labeled.controller,
        nameArray: labeled.nameArray,
        readyText: diplomaFieldController.label,
      }
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomasController.apiEndpoint,
      "GET"
    );

    const baseOpts = {
      withinDialog: true,
      timeout: 1000,
      tabAfter: false,
    };

    await selectMultiplePopoversEnsuringSubmitDisabled("Créer le diplôme", [
      {
        label: controllerLabelRegex(diplomaFieldController),
        items: rx(fx.sample.degreeFieldFetched.name),
        ...baseOpts,
      },
      {
        label: controllerLabelRegex(diplomaYearController),
        items: rx(fx.sample.degreeYearFetched.name),
        ...baseOpts,
      },
      {
        label: controllerLabelRegex(diplomaLevelController),
        items: rx(fx.sample.degreeLevelFetched.name),
        ...baseOpts,
      },
    ]);

    await openPopoverByTriggerName(
      controllerTriggerRegex(diplomaModuleController)
    );

    const modules = [
      fx.sample.skillsModulesFetched.Skills[0].code,
      fx.sample.skillsModulesFetched.Skills[1].code,
    ];

    // Ensure all module options are visible first
    await openPopoverAndExpectByTrigger(
      controllerTriggerRegex(diplomaModuleController),
      modules
    );

    // Select the first module
    await selectCommandItemInContainerEnsuringSubmitDisabled(
      "Créer le diplôme",
      getOpenCommandContainer(),
      rx(fx.sample.skillsModulesFetched.Skills[0].code)
    );

    // Multi-select popover stays open; close it via its trigger (Escape would close the dialog).
    await clickTriggerAndWaitForPopoverState(
      controllerTriggerRegex(diplomaModuleController),
      false
    );

    // The selected module should appear as a tag in the dialog
    await expect
      .element(page.getByText(rx(diplomaFetchedSkills[0].mainSkillCode)))
      .toBeInTheDocument();

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer le diplôme");

    // Ensure modal is closed and title is absent
    await waitForDialogAndAssertText(diplomaFieldController.label, {
      present: false,
    });

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: diplomasQueryKey,
      // diploma created items are indexed under their degreeField group
      expectedValue:
        fx.sample.diplomaCreated.degreeLevel +
        " " +
        fx.sample.diplomaCreated.degreeYear,
      endpoint: diplomasController.apiEndpoint,
      getCallsBefore: getCallsBeforeCreation,
      openPopover: {
        label: controllerLabelRegex(diplomasController),
      },
    });
  });

  test("anti-falsification: selected ids/codes are exactly what gets POSTed", async () => {
    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(
      diplomasController.creationButtonText,
      {
        controller: labeled.controller,
        nameArray: labeled.nameArray,
        readyText: diplomaFieldController.label,
      }
    );

    // Select options
    await selectMultiplePopoversEnsuringSubmitDisabled("Créer le diplôme", [
      {
        label: controllerLabelRegex(diplomaFieldController),
        items: rx(fx.sample.degreeFieldFetched.name),
        withinDialog: true,
        timeout: 1000,
        tabAfter: false,
      },
      {
        label: controllerLabelRegex(diplomaYearController),
        items: rx(fx.sample.degreeYearFetched.name),
        withinDialog: true,
        timeout: 1000,
        tabAfter: false,
      },
      {
        label: controllerLabelRegex(diplomaLevelController),
        items: rx(fx.sample.degreeLevelFetched.name),
        withinDialog: true,
        timeout: 1000,
        tabAfter: false,
      },
    ]);

    // Select modules
    await openPopoverByTriggerName(
      controllerTriggerRegex(diplomaModuleController)
    );

    // Ensure all module options are visible first
    await openPopoverAndExpectByTrigger(
      controllerTriggerRegex(diplomaModuleController),
      [
        fx.sample.skillsModulesFetched.Skills[0].code,
        fx.sample.skillsModulesFetched.Skills[1].code,
      ]
    );

    // Select the first module
    await selectCommandItemInContainerEnsuringSubmitDisabled(
      "Créer le diplôme",
      getOpenCommandContainer(),
      rx(fx.sample.skillsModulesFetched.Skills[0].code)
    );

    // Close the multi-select popover.
    await clickTriggerAndWaitForPopoverState(
      controllerTriggerRegex(diplomaModuleController),
      false
    );

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer le diplôme");

    // Ensure modal is closed and title is absent
    await waitForDialogAndAssertText(diplomaFieldController.label, {
      present: false,
    });

    // Assert exactly what got POSTed
    await expect
      .poll(
        () =>
          getLastPostJsonBodyByUrl(API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint),
        {
          timeout: 2500,
        }
      )
      .toMatchObject({
        diplomaFieldId: fx.sample.degreeFieldFetched.id,
        yearId: fx.sample.degreeYearFetched.id,
        levelId: fx.sample.degreeLevelFetched.id,
        mainSkillsList: [fx.sample.skillsModulesFetched.Skills[0].code],
      });
  });
});
