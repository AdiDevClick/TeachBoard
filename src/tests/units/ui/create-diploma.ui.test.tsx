import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { diplomaFetchedSkills } from "@/tests/samples/class-creation-sample-datas";
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

import type { InputControllerLike } from "@/tests/test-utils/class-creation/regex.functions";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation/regex.functions";
import { initSetup } from "@/tests/units/ui/functions/class-creation/class-creation.functions.ts";
import {
  clickTriggerAndWaitForPopoverState,
  openModalAndAssertItsOpenedAndReady,
} from "@/tests/units/ui/functions/useful-ui.functions";

type SetupResult = Awaited<ReturnType<typeof initSetup>>;

// Test-scope variables that are initialized in the per-test beforeEach
let sample: SetupResult["sample"];
let diplomasController: InputControllerLike;
let diplomaFieldController: InputControllerLike;
let diplomaYearController: InputControllerLike;
let diplomaLevelController: InputControllerLike;
let diplomaModuleController: InputControllerLike;
let diplomasQueryKey: ReturnType<typeof queryKeyFor>;
let labeled: {
  controller: InputControllerLike;
  nameArray: Array<string | RegExp>;
};

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "createDiploma",
      "diplomasController",
      "class-creation"
    );

    sample = res.sample;

    ({
      diplomasController,
      diplomaFieldController,
      diplomaYearController,
      diplomaLevelController,
      diplomaModuleController,
    } = res.controllers);

    diplomasQueryKey = queryKeyFor(diplomasController);
    labeled = {
      controller: diplomasController,
      nameArray: [
        rxJoin(
          sample.diplomaFetched.degreeLevel,
          sample.diplomaFetched.degreeYear
        ),
        rxJoin(
          sample.diplomaFetched2.degreeLevel,
          sample.diplomaFetched2.degreeYear
        ),
      ],
    };

    // Install stubs for this fixture
    res.installFetchStubs?.();
  },
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: create-diploma (from class-creation)", () => {
  test("selections validate, POST updates cache, and class-creation list updates without extra GET", async () => {
    const openButtonLabel: string | RegExp =
      typeof diplomasController.creationButtonText === "string"
        ? diplomasController.creationButtonText
        : /Ajouter/i;

    const diplomasEndpointRaw = diplomasController.apiEndpoint;
    if (typeof diplomasEndpointRaw !== "string") {
      throw new TypeError(
        "Expected diplomasController.apiEndpoint to be a string"
      );
    }

    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(openButtonLabel, {
      controller: labeled.controller,
      nameArray: labeled.nameArray,
      readyText: controllerLabelRegex(diplomaFieldController),
    });

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomasEndpointRaw,
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
        items: rx(sample.degreeFieldFetched.name),
        ...baseOpts,
      },
      {
        label: controllerLabelRegex(diplomaYearController),
        items: rx(sample.degreeYearFetched.name),
        ...baseOpts,
      },
      {
        label: controllerLabelRegex(diplomaLevelController),
        items: rx(sample.degreeLevelFetched.name),
        ...baseOpts,
      },
    ]);

    await openPopoverByTriggerName(
      controllerTriggerRegex(diplomaModuleController)
    );

    const modules = [
      sample.skillsModulesFetched.Skills[0].code,
      sample.skillsModulesFetched.Skills[1].code,
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
      rx(sample.skillsModulesFetched.Skills[0].code)
    );

    // Multi-select popover stays open; close it via its trigger (Escape would close the dialog).
    await clickTriggerAndWaitForPopoverState(
      controllerTriggerRegex(diplomaModuleController),
      false
    );

    // The selected module should appear as a tag in the dialog
    await expect
      .element(page.getByText(rx(diplomaFetchedSkills[0].code)))
      .toBeInTheDocument();

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer le diplôme");

    // Ensure modal is closed and title is absent
    await waitForDialogAndAssertText(
      controllerLabelRegex(diplomaFieldController),
      {
        present: false,
      }
    );

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: diplomasQueryKey,
      // diploma created items are indexed under their degreeField group
      expectedValue:
        sample.diplomaCreated.degreeLevel +
        " " +
        sample.diplomaCreated.degreeYear,
      endpoint: diplomasEndpointRaw,
      getCallsBefore: getCallsBeforeCreation,
      openPopover: {
        label: controllerLabelRegex(diplomasController),
      },
    });
  });

  test("anti-falsification: selected ids/codes are exactly what gets POSTed", async () => {
    const openButtonLabel: string | RegExp =
      typeof diplomasController.creationButtonText === "string"
        ? diplomasController.creationButtonText
        : /Ajouter/i;

    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(openButtonLabel, {
      controller: labeled.controller,
      nameArray: labeled.nameArray,
      readyText: controllerLabelRegex(diplomaFieldController),
    });

    // Select options
    await selectMultiplePopoversEnsuringSubmitDisabled("Créer le diplôme", [
      {
        label: controllerLabelRegex(diplomaFieldController),
        items: rx(sample.degreeFieldFetched.name),
        withinDialog: true,
        timeout: 1000,
        tabAfter: false,
      },
      {
        label: controllerLabelRegex(diplomaYearController),
        items: rx(sample.degreeYearFetched.name),
        withinDialog: true,
        timeout: 1000,
        tabAfter: false,
      },
      {
        label: controllerLabelRegex(diplomaLevelController),
        items: rx(sample.degreeLevelFetched.name),
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
        sample.skillsModulesFetched.Skills[0].code,
        sample.skillsModulesFetched.Skills[1].code,
      ]
    );

    // Select the first module
    await selectCommandItemInContainerEnsuringSubmitDisabled(
      "Créer le diplôme",
      getOpenCommandContainer(),
      rx(sample.skillsModulesFetched.Skills[0].code)
    );

    // Close the multi-select popover.
    await clickTriggerAndWaitForPopoverState(
      controllerTriggerRegex(diplomaModuleController),
      false
    );

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer le diplôme");

    // Ensure modal is closed and title is absent
    await waitForDialogAndAssertText(
      controllerLabelRegex(diplomaFieldController),
      {
        present: false,
      }
    );

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
        diplomaFieldId: sample.degreeFieldFetched.id,
        yearId: sample.degreeYearFetched.id,
        levelId: sample.degreeLevelFetched.id,
        modulesList: [sample.skillsModulesFetched.Skills[0].code],
      });
  });
});
