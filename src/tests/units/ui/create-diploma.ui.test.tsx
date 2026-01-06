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
  openPopoverAndExpectByLabel,
  openPopoverAndExpectByTrigger,
  openPopoverByTriggerName,
  queryKeyFor,
  rx,
  rxJoin,
  selectCommandItemInContainerEnsuringSubmitDisabled,
  selectMultiplePopoversEnsuringSubmitDisabled,
  waitForDialogAndAssertText,
  waitForDialogState,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { AppModals } from "@/pages/AllModals/AppModals.tsx";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation/regex.functions";

const fx = fixtureCreateDiplomaFromClassCreation();
const {
  diplomasController,
  diplomaFieldController,
  diplomaYearController,
  diplomaLevelController,
  diplomaModuleController,
} = fx.controllers;
const diplomasQueryKey = queryKeyFor(diplomasController);

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
    await openPopoverAndExpectByLabel(
      controllerLabelRegex(diplomasController),
      [
        rxJoin(
          fx.sample.diplomaFetched.degreeLevel,
          fx.sample.diplomaFetched.degreeYear
        ),
        rxJoin(
          fx.sample.diplomaFetched2.degreeLevel,
          fx.sample.diplomaFetched2.degreeYear
        ),
      ]
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomasController.apiEndpoint,
      "GET"
    );

    // Open creation modal
    await userEvent.click(
      page.getByRole("button", {
        name: diplomasController.creationButtonText,
      })
    );

    // Ensure modal is opened and title is present
    await waitForDialogAndAssertText(diplomaFieldController.label, {
      present: true,
    });

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
    await userEvent.click(
      page.getByRole("button", {
        name: controllerTriggerRegex(diplomaModuleController),
      })
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
    await openPopoverAndExpectByLabel(
      controllerLabelRegex(diplomasController),
      [
        rxJoin(
          fx.sample.diplomaFetched.degreeLevel,
          fx.sample.diplomaFetched.degreeYear
        ),
        rxJoin(
          fx.sample.diplomaFetched2.degreeLevel,
          fx.sample.diplomaFetched2.degreeYear
        ),
      ]
    );

    // Open creation modal
    await userEvent.click(
      page.getByRole("button", {
        name: diplomasController.creationButtonText,
      })
    );
    await waitForDialogState(true, 1000);

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

    await openPopoverByTriggerName(
      controllerTriggerRegex(diplomaModuleController)
    );
    await openPopoverAndExpectByTrigger(
      controllerTriggerRegex(diplomaModuleController),
      [
        fx.sample.skillsModulesFetched.Skills[0].code,
        fx.sample.skillsModulesFetched.Skills[1].code,
      ]
    );

    await selectCommandItemInContainerEnsuringSubmitDisabled(
      "Créer le diplôme",
      getOpenCommandContainer(),
      rx(fx.sample.skillsModulesFetched.Skills[0].code)
    );

    // Close the multi-select popover.
    await userEvent.click(
      page.getByRole("button", {
        name: controllerTriggerRegex(diplomaModuleController),
      })
    );

    await checkFormValidityAndSubmit("Créer le diplôme");

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
