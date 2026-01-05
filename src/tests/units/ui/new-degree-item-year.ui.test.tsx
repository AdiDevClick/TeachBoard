import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  degreeCreationInputControllersYear,
  diplomaCreationInputControllers,
} from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeYearEndpoint,
  degreeYearFetched,
  degreeYearFetched2,
  degreeYearQueryKey,
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

describe("UI flow: new-degree-item-year", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    stubFetchRoutes({
      getRoutes: [
        [degreeYearEndpoint, [degreeYearFetched, degreeYearFetched2]],
      ],
      postRoutes: [
        [
          API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.YEAR,
          degreeCreatedResponse,
        ],
      ],
      defaultGetPayload: [],
    });

    const diplomaYearController = diplomaCreationInputControllers.find(
      (c) => c.name === "yearId"
    )!;

    render(
      <AppTestWrapper>
        <SamplePopoverInput
          pageId="create-diploma"
          controller={diplomaYearController}
        />
        <AppModals />
      </AppTestWrapper>
    );

    await openPopoverByContainerId(diplomaYearController.id);
    await expectPopoverToContain(new RegExp(degreeYearFetched.name, "i"));
    await expectPopoverToContain(new RegExp(degreeYearFetched2.name, "i"));

    const getCallsBeforeCreation = countFetchCallsByUrl(
      API_ENDPOINTS.GET.DEGREES.endpoints.YEAR,
      "GET"
    );

    await userEvent.click(
      page.getByRole("button", {
        name: diplomaYearController.creationButtonText,
      })
    );

    await expect
      .element(page.getByLabelText(degreeCreationInputControllersYear[0].title))
      .toBeInTheDocument();

    const submitButton = page.getByRole("button", { name: /^Créer$/i });

    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersYear[0].title,
      }),
      degreeCreated.name
    );
    await userEvent.tab();
    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersYear[1].title,
      }),
      degreeCreated.code
    );
    await userEvent.tab();

    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersYear[2].title,
      }),
      "Description valide"
    );
    await userEvent.tab();

    await expect.element(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    const cached = (await waitForCache(degreeYearQueryKey)) as Array<
      CachedGroup<CachedSelectItem>
    >;
    expect(cached[0]?.items.some((i) => i.value === degreeCreated.name)).toBe(
      true
    );

    await openPopoverByContainerId(diplomaYearController.id);
    await expectPopoverToContain(new RegExp(degreeCreated.name, "i"));

    expect(
      countFetchCallsByUrl(API_ENDPOINTS.GET.DEGREES.endpoints.YEAR, "GET")
    ).toBe(getCallsBeforeCreation);
  });
});
