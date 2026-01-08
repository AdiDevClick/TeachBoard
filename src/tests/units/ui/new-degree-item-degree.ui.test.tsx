import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeCreationInputControllersDegree } from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeLevelFetched,
  degreeLevelFetched2,
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
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions.ts";
import { afterEach, describe, test, vi } from "vitest";
import { page } from "vitest/browser";

const fx = fixtureNewDegreeItem("LEVEL");
const diplomaLevelController = fx.controller;
const degreeLevelQueryKey = queryKeyFor(diplomaLevelController);
const levels = [degreeLevelFetched.name, degreeLevelFetched2.name];

setupUiTestState(
  <AppTestWrapper>
    <SamplePopoverInput
      pageId="create-diploma"
      controller={diplomaLevelController}
    />
    <AppModals />
  </AppTestWrapper>,
  { beforeEach: () => fx.installFetchStubs(degreeCreatedResponse) }
);

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
      }
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomaLevelController.apiEndpoint,
      "GET"
    );

    // Fill fields
    await fillFieldsEnsuringSubmitDisabled("Créer", [
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersDegree[0].title,
        }),
        value: degreeCreated.name,
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersDegree[1].title,
        }),
        value: degreeCreated.code,
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersDegree[2].title,
        }),
        value: "Description valide",
      },
    ]);

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer");

    // Ensure modal is closed and title is absent
    await waitForDialogAndAssertText(
      degreeCreationInputControllersDegree[0].title,
      { present: false }
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
});
