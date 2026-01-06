import { degreeCreationInputControllersYear } from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeYearFetched,
  degreeYearFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { fixtureNewDegreeItem } from "@/tests/samples/ui-fixtures/class-creation.ui.fixtures";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { controllerLabelRegex } from "@/tests/test-utils/class-creation/regex.functions";
import { assertPostUpdatedCacheWithoutExtraGet } from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  fillFieldsEnsuringSubmitDisabled,
  openPopoverAndExpectByLabel,
  queryKeyFor,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

const fx = fixtureNewDegreeItem("YEAR");
const diplomaYearController = fx.controller;
const degreeYearQueryKey = queryKeyFor(diplomaYearController);

setupUiTestState(
  <AppTestWrapper>
    <SamplePopoverInput
      pageId="create-diploma"
      controller={diplomaYearController}
    />
    <AppModals />
  </AppTestWrapper>,
  { beforeEach: () => fx.installFetchStubs(degreeCreatedResponse) }
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-degree-item-year", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    // Open templates popover and assert existing names
    const years = [degreeYearFetched.name, degreeYearFetched2.name];
    await openPopoverAndExpectByLabel(
      controllerLabelRegex(diplomaYearController),
      years
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      diplomaYearController.apiEndpoint,
      "GET"
    );

    // Open creation modal
    await userEvent.click(
      page.getByRole("button", {
        name: diplomaYearController.creationButtonText,
      })
    );

    // Ensure modal is opened and title is present
    await waitForDialogAndAssertText(
      degreeCreationInputControllersYear[0].title,
      { present: true }
    );

    await fillFieldsEnsuringSubmitDisabled("Créer", [
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersYear[0].title,
        }),
        value: degreeCreated.name,
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersYear[1].title,
        }),
        value: degreeCreated.code,
      },
      {
        locator: page.getByRole("textbox", {
          name: degreeCreationInputControllersYear[2].title,
        }),
        value: "Description valide",
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
      endpoint: diplomaYearController.apiEndpoint,
      getCallsBefore: getCallsBeforeCreation,
      openPopover: { label: controllerLabelRegex(diplomaYearController) },
    });
  });
});
