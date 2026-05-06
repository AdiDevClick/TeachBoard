import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import DegreeModule from "@/features/class-creation/components/DegreeModule/DegreeModule";
import { degreeModuleCreationInputControllers } from "@/features/class-creation/components/DegreeModule/forms/degree-module-inputs";
import { DEGREE_MODULE_SKILL_CARD_TITLE } from "@/features/class-creation/components/DegreeModuleSkill/config/degree-module-skill.configs";
import {
  DEGREE_MODULE_SKILL_REQUIRED_SCORES,
  createDefaultDegreeModuleSkillJustifications,
} from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import {
  skillCreated,
  skillFetched,
} from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  assertPostUpdatedCacheWithoutExtraGet,
  waitForCache,
} from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  fillFieldsEnsuringSubmitDisabled,
  queryKeyFor,
  rx,
  stubFetchRoutes,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

const stringifyConsoleArgs = (args: unknown[]) => args.map(String).join(" ");

const containsControllerRenderWarning = (messages: string[]) =>
  messages.some(
    (message) =>
      message.includes("Cannot update a component") &&
      message.includes("while rendering a different component") &&
      message.includes("Controller"),
  );

const captureReactWarnings = () => {
  const messages: string[] = [];

  const push = (...args: unknown[]) => {
    messages.push(stringifyConsoleArgs(args));
  };

  const errorSpy = vi.spyOn(console, "error").mockImplementation(push);
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(push);

  return {
    messages,
    restore: () => {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    },
  };
};

const skillsController = degreeModuleCreationInputControllers.find(
  (c) => c.name === "skillList",
)!;
const skillQueryKey = queryKeyFor(skillsController);

setupUiTestState(
  <AppTestWrapper>
    <DegreeModule modalMode={false} />
    <AppModals />
  </AppTestWrapper>,
  {
    beforeEach: () =>
      stubFetchRoutes({
        getRoutes: [["/api/skills/sub", { Skills: [skillFetched] }]],
        postRoutes: [["/api/skills/sub", skillCreated]],
      }),
  },
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DegreeModuleSkill modal UI interaction", () => {
  test("adding multiple criteria does not trigger Controller render warning", async () => {
    const warningCapture = captureReactWarnings();

    try {
      await openModalAndAssertItsOpenedAndReady(
        skillsController.creationButtonText,
        {
          controller: skillsController,
          nameArray: [skillFetched.code],
          readyText: DEGREE_MODULE_SKILL_CARD_TITLE.title,
        },
      );

      const addCriteriaButton = page.getByRole("button", {
        name: /Ajouter un critère/i,
      });

      await expect
        .poll(() => addCriteriaButton.query(), { timeout: 100 })
        .toBeEnabled();

      await addCriteriaButton.click();
      await addCriteriaButton.click();
      await addCriteriaButton.click();
      await addCriteriaButton.click();
      await addCriteriaButton.click();

      // Force a render path on textarea controllers after append to match the manual scenario.
      const firstDescriptionField = document.querySelector("textarea");

      if (!(firstDescriptionField instanceof HTMLTextAreaElement)) {
        throw new TypeError(
          "Aucune textarea trouvée pour reproduire le warning",
        );
      }

      await page.elementLocator(firstDescriptionField).fill("repro warning");

      await expect
        .poll(
          () =>
            warningCapture.messages
              .filter((message) => containsControllerRenderWarning([message]))
              .join("\n\n"),
          {
            timeout: 1500,
          },
        )
        .toBe("");
    } finally {
      warningCapture.restore();
    }
  });

  test("clicking add new opens modal, form validates and POST updates cache and command list", async () => {
    // Open popover (command list) and assert it contains fetched skills
    await openModalAndAssertItsOpenedAndReady(
      skillsController.creationButtonText,
      {
        controller: skillsController,
        nameArray: [skillFetched.code],
        readyText: DEGREE_MODULE_SKILL_CARD_TITLE.title,
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      skillsController.apiEndpoint,
      "GET",
    );

    // Match the stubbed POST payload/response shape
    const modalForm = document.getElementById("new-degree-module-skill-form");

    if (!(modalForm instanceof HTMLFormElement)) {
      throw new TypeError("new-degree-module-skill-form introuvable");
    }

    const modalInputs = Array.from(
      modalForm.querySelectorAll<HTMLInputElement>(
        'input[type="text"], input:not([type])',
      ),
    ).filter((input) => !input.disabled && input.type !== "hidden");

    const [nameInput, codeInput] = modalInputs;

    if (!nameInput || !codeInput) {
      throw new TypeError("Champs name/code introuvables dans le modal");
    }

    const defaultJustifications =
      createDefaultDegreeModuleSkillJustifications();

    const addCriteriaButton = page.getByRole("button", {
      name: /Ajouter un critère/i,
    });

    const desiredCriteriaCount = defaultJustifications.length;

    for (let i = 0; i < desiredCriteriaCount + 1; i += 1) {
      const currentCriteriaCount =
        modalForm.querySelectorAll("textarea").length;

      if (currentCriteriaCount >= desiredCriteriaCount) {
        break;
      }

      await addCriteriaButton.click();
    }

    const criteriaTextAreas = Array.from(
      modalForm.querySelectorAll<HTMLTextAreaElement>("textarea"),
    ).filter((textarea) => !textarea.disabled);

    if (criteriaTextAreas.length < desiredCriteriaCount) {
      throw new TypeError(
        `Textareas insuffisantes: ${criteriaTextAreas.length}/${desiredCriteriaCount}`,
      );
    }

    const fills = [
      {
        locator: page.elementLocator(nameInput),
        value: "new",
      },
      {
        locator: page.elementLocator(codeInput),
        value: "NEW",
      },
      ...defaultJustifications.map((_, index) => ({
        locator: page.elementLocator(criteriaTextAreas[index]),
        value: `Critere du palier ${DEGREE_MODULE_SKILL_REQUIRED_SCORES[index]}`,
      })),
    ];

    await fillFieldsEnsuringSubmitDisabled("Ajouter", fills);
    // Last tab blurs the final field so RHF (onTouched) can compute validity

    await expect
      .poll(() => page.getByRole("button", { name: /^Ajouter$/i }).query())
      .toBeEnabled();

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Ajouter");

    // Modal closes on success — assert dialog closed and title absent
    await waitForDialogAndAssertText(DEGREE_MODULE_SKILL_CARD_TITLE.title, {
      present: false,
    });

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: skillQueryKey,
      expectedValue: skillCreated.code,
      getCallsBefore: getCallsBeforeCreation,
      endpoint: skillsController.apiEndpoint,
      openPopover: { trigger: rx(skillsController.placeholder) },
      post: {
        endpoint: API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL,
        count: 1,
        timeout: 2500,
      },
    });

    // Additional strict assertion: check full cache shape
    const cached = await waitForCache(skillQueryKey);
    expect(cached).toEqual([
      {
        groupTitle: "Tous",
        items: expect.arrayContaining([
          expect.objectContaining(skillFetched),
          expect.objectContaining(skillCreated),
        ]),
      },
    ]);
  });
});
