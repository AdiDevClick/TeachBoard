import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeCreationInputControllersDegree } from "@/features/class-creation/components/DegreeItem/forms/degree-item-inputs";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeLevelFetched,
  degreeLevelFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { controllerLabelRegex } from "@/tests/test-utils/class-creation/regex.functions";
import { assertPostUpdatedCacheWithoutExtraGet } from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  fillFieldsEnsuringSubmitDisabled,
  queryKeyFor,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { initSetup } from "@/tests/units/ui/functions/class-creation/class-creation.functions.ts";
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions.ts";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

let diplomaLevelController: any;
let degreeLevelQueryKey: any;
let levels: string[];

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "newDegree",
      "diplomaLevelController",
      "create-diploma",
      { routeArgs: ["LEVEL"] },
    );

    diplomaLevelController = res.controllers.diplomaLevelController;
    degreeLevelQueryKey = queryKeyFor(diplomaLevelController);
    levels = [degreeLevelFetched.name, degreeLevelFetched2.name];

    res.installFetchStubs?.(degreeCreatedResponse);
  },
});

beforeEach(() => {});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-degree-item-degree", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(
      diplomaLevelController.creationButtonText,
      {
        controller: diplomaLevelController,
        nameArray: levels,
        readyText: degreeCreationInputControllersDegree[0].title,
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomaLevelController.apiEndpoint,
      "GET",
    );

    // Fill required fields
    await fillFieldsEnsuringSubmitDisabled("Créer", [
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersDegree[0].title,
        }),
        value: degreeCreated.name,
      },
      // !! IMPORTANT : Verify description BEFORE code or the form might be valid as Description is optional
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersDegree[2].title,
        }),
        value: "Description valide",
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersDegree[1].title,
        }),
        value: degreeCreated.code,
      },
    ]);

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer");

    // Ensure modal is closed and title is absent
    await waitForDialogAndAssertText(
      degreeCreationInputControllersDegree[0].title,
      { present: false },
    );

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: degreeLevelQueryKey,
      expectedValue: degreeCreated.name,
      endpoint: diplomaLevelController.apiEndpoint,
      getCallsBefore: getCallsBeforeCreation,
      openPopover: { label: controllerLabelRegex(diplomaLevelController) },
      post: {
        endpoint: API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.LEVEL,
        count: 1,
        timeout: 2500,
      },
    });
  });

  test("description optionnelle : un caractère invalide déclenche l'erreur, l'ajout d'un caractère la maintient, vider le champ devrait la supprimer (BUG : le regex serverName interdit la chaîne vide)", async () => {
    // Open modal
    await openModalAndAssertItsOpenedAndReady(
      diplomaLevelController.creationButtonText,
      {
        controller: diplomaLevelController,
        nameArray: levels,
        readyText: degreeCreationInputControllersDegree[0].title,
      },
    );

    const descInput = page.getByRole("textbox", {
      name: degreeCreationInputControllersDegree[2].title,
    });

    await fillFieldsEnsuringSubmitDisabled("Créer", [
      // Step 1+2 : bad char → aria-invalid="true"
      {
        locator: descInput,
        value: "<",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 3+4+5 : append chars → error persists -> submit disabled
      {
        locator: descInput,
        value: "<extra",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 6 : valid value → aria-invalid="false" + submit disabled
      {
        locator: descInput,
        value: "Legit description",
        assertAttribute: "aria-invalid",
        toBe: "false",
      },
    ]);

    // Step 7 : clear field —>  optional should be aria-invalid="false"
    // BUG : le regex serverName exige {1,100} caractères, donc la chaîne vide échoue toujours
    await userEvent.clear(descInput);
    await expect
      .poll(() => descInput.element().getAttribute("aria-invalid"))
      .toBe("false");
  });
});
