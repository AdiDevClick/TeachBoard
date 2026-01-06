import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  degreeFieldEndpoint,
  degreeFieldFetched,
  degreeFieldFetched2,
  degreeLevelEndpoint,
  degreeLevelFetched,
  degreeLevelFetched2,
  degreeYearEndpoint,
  degreeYearFetched,
  degreeYearFetched2,
  diplomaCreated,
  diplomaEndpoint,
  diplomaFetched,
  diplomaFetched2,
  diplomaFetchedSkills,
  diplomaQueryKey,
  skillsModulesFetched,
  stubFetchRoutes,
} from "@/tests/samples/class-creation-sample-datas";
import {
  AppTestWrapper,
  expectPopoverToContain,
  setupUiTestState,
} from "@/tests/test-utils/class-creation.ui.shared";
import { waitForCache } from "@/tests/test-utils/tests.functions";
import {
  countFetchCallsByUrl,
  getOpenCommandContainer,
  openPopoverByLabelText,
  openPopoverByTriggerName,
  selectCommandItemInContainer,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import {
  classCreationInputControllers,
  diplomaCreationInputControllers,
} from "@/data/inputs-controllers.data";
import { SamplePopoverInput } from "@/tests/test-utils/class-creation.ui.components.tsx";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation.ui.factories";

type CachedGroup<TItem> = { groupTitle: string; items: TItem[] };

setupUiTestState();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: create-diploma (from class-creation)", () => {
  test("selections validate, POST updates cache, and class-creation list updates without extra GET", async () => {
    stubFetchRoutes({
      getRoutes: [
        [
          diplomaEndpoint,
          { [diplomaFetched.degreeField]: [diplomaFetched, diplomaFetched2] },
        ],
        [degreeFieldEndpoint, [degreeFieldFetched, degreeFieldFetched2]],
        [degreeYearEndpoint, [degreeYearFetched, degreeYearFetched2]],
        [degreeLevelEndpoint, [degreeLevelFetched, degreeLevelFetched2]],
        [API_ENDPOINTS.GET.SKILLS.endPoints.MODULES, skillsModulesFetched],
      ],
      postRoutes: [
        [API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint, diplomaCreated],
      ],
      defaultGetPayload: [],
    });

    const classDiplomasController = classCreationInputControllers.find(
      (c) => c.name === "degreeConfigId" && c.task === "create-diploma"
    )!;

    const diplomaYearController = diplomaCreationInputControllers.find(
      (c) => c.name === "yearId"
    )!;
    const diplomaLevelController = diplomaCreationInputControllers.find(
      (c) => c.name === "levelId"
    )!;
    const diplomaModuleController = diplomaCreationInputControllers.find(
      (c) => c.name === "mainSkillsList"
    )!;

    const diplomaFieldController = diplomaCreationInputControllers.find(
      (c) => c.name === "diplomaFieldId"
    )!;

    render(
      <AppTestWrapper>
        <AppModals />
        <SamplePopoverInput
          pageId="class-creation"
          controller={classDiplomasController}
        />
      </AppTestWrapper>
    );

    await openPopoverByLabelText(controllerLabelRegex(classDiplomasController));

    // Ensure both diplomas are visible
    const diplomas = [
      new RegExp(
        String.raw`${diplomaFetched.degreeLevel}\s+${diplomaFetched.degreeYear}`,
        "i"
      ),
      new RegExp(
        String.raw`${diplomaFetched2.degreeLevel}\s+${diplomaFetched2.degreeYear}`,
        "i"
      ),
    ];
    for (const d of diplomas) await expectPopoverToContain(d);

    await userEvent.click(
      page.getByRole("button", {
        name: classDiplomasController.creationButtonText,
      })
    );
    await expect
      .poll(
        () =>
          document.querySelector(
            '[data-slot="dialog-content"][data-state="open"]'
          ) !== null,
        { timeout: 1000 }
      )
      .toBe(true);
    await expect
      .element(page.getByText(diplomaFieldController.label))
      .toBeInTheDocument();

    await openPopoverByLabelText(controllerLabelRegex(diplomaFieldController), {
      withinDialog: true,
      timeout: 1000,
    });

    // Ensure all fields are visible then select
    const fields = [degreeFieldFetched.name, degreeFieldFetched2.name];
    for (const f of fields) await expectPopoverToContain(new RegExp(f, "i"));

    await selectCommandItemInContainer(
      getOpenCommandContainer(),
      new RegExp(degreeFieldFetched.name, "i")
    );

    await openPopoverByLabelText(controllerLabelRegex(diplomaYearController), {
      withinDialog: true,
      timeout: 1000,
    });

    // Ensure all years are visible then select
    const years = [degreeYearFetched.name, degreeYearFetched2.name];
    for (const y of years) await expectPopoverToContain(new RegExp(y, "i"));

    await selectCommandItemInContainer(
      getOpenCommandContainer(),
      new RegExp(degreeYearFetched.name, "i")
    );

    await openPopoverByLabelText(controllerLabelRegex(diplomaLevelController), {
      withinDialog: true,
      timeout: 1000,
    });

    const names = [degreeLevelFetched.name, degreeLevelFetched2.name];

    // Ensure all items are visible before selecting (selection may close the popover)
    for (const element of names) {
      await expectPopoverToContain(new RegExp(element, "i"));
    }

    // Select the intended one
    await selectCommandItemInContainer(
      getOpenCommandContainer(),
      new RegExp(degreeLevelFetched.name, "i")
    );

    await openPopoverByTriggerName(
      controllerTriggerRegex(diplomaModuleController)
    );

    const modules = [
      skillsModulesFetched.Skills[0].code,
      skillsModulesFetched.Skills[1].code,
    ];

    // Ensure all module options are visible first
    for (const mod of modules) {
      await expectPopoverToContain(new RegExp(mod, "i"));
    }

    // Select the first module
    await selectCommandItemInContainer(
      getOpenCommandContainer(),
      new RegExp(skillsModulesFetched.Skills[0].code, "i")
    );

    // Multi-select popover stays open; close it via its trigger (Escape would close the dialog).
    await userEvent.click(
      page.getByRole("button", {
        name: controllerTriggerRegex(diplomaModuleController),
      })
    );

    // The selected module should appear as a tag in the dialog
    await expect
      .poll(
        () =>
          Array.from(document.querySelectorAll("*")).some((el) =>
            new RegExp(diplomaFetchedSkills[0].mainSkillCode, "i").test(
              el.textContent ?? ""
            )
          ),
        { timeout: 1000 }
      )
      .toBe(true);

    const getCallsBeforeCreation = countFetchCallsByUrl(
      API_ENDPOINTS.GET.DIPLOMAS.endpoint,
      "GET"
    );

    const submit = page.getByRole("button", { name: /Créer le diplôme/i });
    await expect.element(submit).toBeEnabled();
    await userEvent.click(submit);

    await expect
      .element(page.getByText(/Création de diplômes ou certifications/i))
      .not.toBeInTheDocument();

    const cached = (await waitForCache(diplomaQueryKey)) as Array<
      CachedGroup<{ id: string }>
    >;
    const group = cached.find(
      (g) => g.groupTitle === diplomaCreated.degreeField
    );
    expect(group?.items.some((i) => i.id === diplomaCreated.id)).toBe(true);

    // Validate class-creation command list refreshes from cache (no extra GET)
    await openPopoverByLabelText(controllerLabelRegex(classDiplomasController));
    await expectPopoverToContain(
      new RegExp(
        String.raw`${diplomaCreated.degreeLevel}\s+${diplomaCreated.degreeYear}`,
        "i"
      )
    );

    expect(
      countFetchCallsByUrl(API_ENDPOINTS.GET.DIPLOMAS.endpoint, "GET")
    ).toBe(getCallsBeforeCreation);
  });
});
