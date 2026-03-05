import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeCreationInputControllersField } from "@/features/class-creation/components/DegreeItem/forms/degree-item-inputs";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeFieldFetched,
  degreeFieldFetched2,
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
import { afterEach, beforeEach, describe, test, vi } from "vitest";
import { page } from "vitest/browser";

let diplomaFieldController: any;
let degreeFieldQueryKey: any;
let fields: string[];

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "newDegree",
      "diplomaFieldController",
      "create-diploma",
      { routeArgs: ["FIELD"] },
    );

    diplomaFieldController = res.controllers.diplomaFieldController;
    degreeFieldQueryKey = queryKeyFor(diplomaFieldController);
    fields = [degreeFieldFetched.name, degreeFieldFetched2.name];

    res.installFetchStubs?.(degreeCreatedResponse);
  },
});

beforeEach(() => {});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-degree-item-field", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(
      diplomaFieldController.creationButtonText,
      {
        controller: diplomaFieldController,
        nameArray: fields,
        readyText: degreeCreationInputControllersField[0].title,
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomaFieldController.apiEndpoint,
      "GET",
    );

    // Fill required fields
    await fillFieldsEnsuringSubmitDisabled("Créer", [
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersField[0].title,
        }),
        value: degreeCreated.name,
      },
      // !! IMPORTANT !! Optional field should be tested BEFORE the required code field, as it can validate the form
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersField[2].title,
        }),
        value: "Description valide",
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersField[1].title,
        }),
        value: degreeCreated.code,
      },
    ]);

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer");

    // Ensure modal is closed and the modal title is absent
    await waitForDialogAndAssertText(
      /Création d'un nouveau domaine \/ métier/i,
      { present: false },
    );

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: degreeFieldQueryKey,
      expectedValue: degreeCreated.name,
      endpoint: diplomaFieldController.apiEndpoint,
      getCallsBefore: getCallsBeforeCreation,
      openPopover: { label: controllerLabelRegex(diplomaFieldController) },
      post: {
        endpoint: API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.FIELD,
        count: 1,
        timeout: 2500,
      },
    });
  });

  test("description optionnelle : un caractère invalide déclenche l'erreur, l'ajout d'un caractère la maintient, vider le champ devrait la supprimer (BUG : le regex serverName interdit la chaîne vide)", async () => {
    // Open modal
    await openModalAndAssertItsOpenedAndReady(
      diplomaFieldController.creationButtonText,
      {
        controller: diplomaFieldController,
        nameArray: fields,
        readyText: degreeCreationInputControllersField[0].title,
      },
    );

    const descInput = page.getByRole("textbox", {
      name: degreeCreationInputControllersField[2].title,
    });

    await fillFieldsEnsuringSubmitDisabled("Créer", [
      // Step 1+2 : bad char → aria-invalid="true"
      {
        locator: descInput,
        value: "<!!Quite bad input",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 3+4 : append chars → error persists
      {
        locator: descInput,
        value: "<!!Quite bad input with some valid chars",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 5 : valid value → aria-invalid="false" + submit disabled
      {
        locator: descInput,
        value: "Description valide",
        assertAttribute: "aria-invalid",
        toBe: "false",
      },
      // Step 6 : cleared field should be aria-invalid="false"
      {
        locator: descInput,
        clearInput: true,
        assertAttribute: "aria-invalid",
        toBe: "false",
      },
    ]);
  });
});
