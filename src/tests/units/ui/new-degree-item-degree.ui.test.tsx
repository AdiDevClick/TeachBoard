import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  degreeCreationInputControllersDegree,
  diplomaCreationInputControllers,
} from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  degreeCreated,
  degreeCreatedResponse,
  degreeLevelEndpoint,
  degreeLevelFetched,
  degreeLevelFetched2,
  degreeLevelQueryKey,
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

describe("UI flow: new-degree-item-degree", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    stubFetchRoutes({
      getRoutes: [
        [degreeLevelEndpoint, [degreeLevelFetched, degreeLevelFetched2]],
      ],
      postRoutes: [
        [
          API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.LEVEL,
          degreeCreatedResponse,
        ],
      ],
      defaultGetPayload: [],
    });

    const diplomaLevelController = diplomaCreationInputControllers.find(
      (c) => c.name === "levelId"
    )!;

    render(
      <AppTestWrapper>
        <SamplePopoverInput
          pageId="create-diploma"
          controller={diplomaLevelController}
        />
        <AppModals />
      </AppTestWrapper>
    );

    await openPopoverByContainerId(diplomaLevelController.id);

    await expectPopoverToContain(new RegExp(degreeLevelFetched.name, "i"));
    await expectPopoverToContain(new RegExp(degreeLevelFetched2.name, "i"));

    const getCallsBeforeCreation = countFetchCallsByUrl(
      API_ENDPOINTS.GET.DEGREES.endpoints.LEVEL,
      "GET"
    );

    await userEvent.click(
      page.getByRole("button", {
        name: diplomaLevelController.creationButtonText,
      })
    );

    await expect
      .element(
        page.getByLabelText(degreeCreationInputControllersDegree[0].title)
      )
      .toBeInTheDocument();

    const submitButton = page.getByRole("button", { name: /^Créer$/i });

    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersDegree[0].title,
      }),
      degreeCreated.name
    );
    await userEvent.tab();
    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersDegree[1].title,
      }),
      degreeCreated.code
    );
    await userEvent.tab();

    await userEvent.fill(
      page.getByRole("textbox", {
        name: degreeCreationInputControllersDegree[2].title,
      }),
      "Description valide"
    );
    await userEvent.tab();

    await expect.element(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    const cached = (await waitForCache(degreeLevelQueryKey)) as Array<
      CachedGroup<CachedSelectItem>
    >;
    expect(cached[0]?.items.some((i) => i.value === degreeCreated.name)).toBe(
      true
    );

    await openPopoverByContainerId(diplomaLevelController.id);
    await expectPopoverToContain(new RegExp(degreeCreated.name, "i"));

    expect(
      countFetchCallsByUrl(API_ENDPOINTS.GET.DEGREES.endpoints.LEVEL, "GET")
    ).toBe(getCallsBeforeCreation);
  });
});
