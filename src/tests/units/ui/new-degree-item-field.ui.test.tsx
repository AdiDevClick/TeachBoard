import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeCreationInputControllersField } from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeFieldFetched,
  degreeFieldFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { fixtureNewDegreeItem } from "@/tests/samples/ui-fixtures/class-creation.ui.fixtures";
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
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions";
import { afterEach, describe, test, vi } from "vitest";
import { page } from "vitest/browser";

const fx = fixtureNewDegreeItem("FIELD");
const diplomaFieldController = fx.controller;
const degreeFieldQueryKey = queryKeyFor(diplomaFieldController);

setupUiTestState(
  <AppTestWrapper>
    <SamplePopoverInput
      pageId="create-diploma"
      controller={diplomaFieldController}
    />
    <AppModals />
  </AppTestWrapper>,
  { beforeEach: () => fx.installFetchStubs(degreeCreatedResponse) }
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-degree-item-field", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    // Open templates popover and assert existing names
    const fields = [degreeFieldFetched.name, degreeFieldFetched2.name];
    await openModalAndAssertItsOpenedAndReady(
      diplomaFieldController.creationButtonText,
      {
        controller: diplomaFieldController,
        nameArray: fields,
        readyText: degreeCreationInputControllersField[0].title,
      }
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomaFieldController.apiEndpoint,
      "GET"
    );

    // await submitButtonShouldBeDisabled("Créer");

    await fillFieldsEnsuringSubmitDisabled("Créer", [
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersField[0].title,
        }),
        value: degreeCreated.name,
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersField[1].title,
        }),
        value: degreeCreated.code,
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersField[2].title,
        }),
        value: "Description valide",
      },
    ]);

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer");

    // Ensure modal is closed and the modal title is absent
    await waitForDialogAndAssertText(
      /Création d'un nouveau domaine \/ métier/i,
      { present: false }
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
});
