import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  degreeCreationInputControllersField,
  diplomaCreationInputControllers,
} from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeFieldEndpoint,
  degreeFieldFetched,
  degreeFieldFetched2,
  degreeFieldQueryKey,
  stubFetchRoutes,
} from "@/tests/samples/class-creation-sample-datas";
import { SamplePopoverInput } from "@/tests/test-utils/class-creation.ui.components.tsx";
import {
  AppTestWrapper,
  expectPopoverToContain,
  setupUiTestState,
} from "@/tests/test-utils/class-creation.ui.shared";
import { waitForCache } from "@/tests/test-utils/tests.functions";
import {
  countFetchCallsByUrl,
  openPopoverByContainerId,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

type CachedGroup<TItem> = { groupTitle: string; items: TItem[] };
type CachedSelectItem = { id: string; value: string };

setupUiTestState();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-degree-item-field", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    stubFetchRoutes({
      getRoutes: [
        [degreeFieldEndpoint, [degreeFieldFetched, degreeFieldFetched2]],
      ],
      postRoutes: [
        [
          API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.FIELD,
          degreeCreatedResponse,
        ],
      ],
      defaultGetPayload: [],
    });

    const diplomaFieldController = diplomaCreationInputControllers.find(
      (c) => c.name === "diplomaFieldId"
    )!; // controller from app data for diploma field input

    render(
      <AppTestWrapper>
        <SamplePopoverInput
          pageId="create-diploma"
          controller={diplomaFieldController}
        />
        <AppModals />
      </AppTestWrapper>
    );

    await openPopoverByContainerId(diplomaFieldController.id);
    await expectPopoverToContain(new RegExp(degreeFieldFetched.name, "i"));
    await expectPopoverToContain(new RegExp(degreeFieldFetched2.name, "i"));

    const getCallsBeforeCreation = countFetchCallsByUrl(
      API_ENDPOINTS.GET.DEGREES.endpoints.FIELD,
      "GET"
    );

    await userEvent.click(
      page.getByRole("button", {
        name: diplomaFieldController.creationButtonText,
      })
    );

    await expect
      .element(
        page.getByLabelText(degreeCreationInputControllersField[0].title)
      )
      .toBeInTheDocument();

    const submitButton = page.getByRole("button", { name: /^Créer$/i });

    await expect.element(submitButton).toBeDisabled();

    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersField[0].title,
      }),
      degreeCreated.name
    );
    await userEvent.tab();
    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersField[1].title,
      }),
      degreeCreated.code
    );
    await userEvent.tab();

    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersField[2].title,
      }),
      "Description valide"
    );
    await userEvent.tab();

    await expect.element(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    await expect
      .element(page.getByText(/Création d'un nouveau domaine \/ métier/i))
      .not.toBeInTheDocument();

    const cached = (await waitForCache(degreeFieldQueryKey)) as Array<
      CachedGroup<CachedSelectItem>
    >;
    expect(cached[0]?.items.some((i) => i.value === degreeCreated.name)).toBe(
      true
    );

    await openPopoverByContainerId(diplomaFieldController.id);
    await expectPopoverToContain(new RegExp(degreeCreated.name, "i"));

    expect(
      countFetchCallsByUrl(API_ENDPOINTS.GET.DEGREES.endpoints.FIELD, "GET")
    ).toBe(getCallsBeforeCreation);
  });
});
