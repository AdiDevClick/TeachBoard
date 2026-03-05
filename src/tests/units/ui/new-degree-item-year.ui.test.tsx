import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeCreationInputControllersYear } from "@/features/class-creation/components/DegreeItem/forms/degree-item-inputs";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeYearFetched,
  degreeYearFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import type { InputControllerLike } from "@/tests/test-utils/class-creation/regex.functions";
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
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

let diplomaYearController: InputControllerLike;
let degreeYearQueryKey: ReturnType<typeof queryKeyFor>;
let years: string[];

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "newDegree",
      "diplomaYearController",
      "create-diploma",
      { routeArgs: ["YEAR"] },
    );

    diplomaYearController = res.controllers.diplomaYearController;

    degreeYearQueryKey = queryKeyFor(diplomaYearController);
    years = [degreeYearFetched.name, degreeYearFetched2.name];

    res.installFetchStubs?.(degreeCreatedResponse);
  },
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-degree-item-year", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    const apiEndpointRaw = diplomaYearController.apiEndpoint;
    if (typeof apiEndpointRaw !== "string") {
      throw new TypeError("Expected a string apiEndpoint for year controller");
    }

    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(
      String(diplomaYearController.creationButtonText),
      {
        controller: diplomaYearController,
        nameArray: years,
        readyText: degreeCreationInputControllersYear[0].title,
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(apiEndpointRaw, "GET");

    // Fill required fields
    await fillFieldsEnsuringSubmitDisabled("Créer", [
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersYear[0].title,
        }),
        value: degreeCreated.name,
      },
      // !! IMPORTANT !! Optional field should be tested BEFORE the required code field, as it can validate the form
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersYear[2].title,
        }),
        value: "Description valide",
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersYear[1].title,
        }),
        value: degreeCreated.code,
      },
    ]);

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer");

    // Ensure modal is closed and the modal title is absent
    await waitForDialogAndAssertText(/Création d'une nouvelle année/i, {
      present: false,
    });

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: degreeYearQueryKey,
      expectedValue: degreeCreated.name,
      endpoint: String(diplomaYearController.apiEndpoint),
      getCallsBefore: getCallsBeforeCreation,
      openPopover: { label: controllerLabelRegex(diplomaYearController) },
      post: {
        endpoint: API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.YEAR,
        count: 1,
        timeout: 2500,
      },
    });
  });

  test("description optionnelle : un caractère invalide déclenche l'erreur, l'ajout d'un caractère la maintient, vider le champ devrait la supprimer (BUG : le regex serverName interdit la chaîne vide)", async () => {
    // Open modal
    await openModalAndAssertItsOpenedAndReady(
      String(diplomaYearController.creationButtonText),
      {
        controller: diplomaYearController,
        nameArray: years,
        readyText: degreeCreationInputControllersYear[0].title,
      },
    );

    const descInput = page.getByRole("textbox", {
      name: degreeCreationInputControllersYear[2].title,
    });

    await fillFieldsEnsuringSubmitDisabled("Créer", [
      // Step 1+2 : bad char → aria-invalid="true"
      {
        locator: descInput,
        value: "<!!Quite bad input there",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 3+4 : append chars → error persists
      {
        locator: descInput,
        value: "<!!Quite bad input there with some extra chars",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 5 :  append valid chars -> no error
      {
        locator: descInput,
        value: "This is a legit description field",
        assertAttribute: "aria-invalid",
        toBe: "false",
      },
      // Step 6 : Cleared field should be aria-invalid="false"
      {
        locator: descInput,
        clearInput: true,
        assertAttribute: "aria-invalid",
        toBe: "false",
      },
    ]);
  });
});
