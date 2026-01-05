import { DegreeModuleController } from "@/components/ClassCreation/diploma/degree-module/controller/DegreeModuleController";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  skillCreated,
  skillFetched,
  skillSubQueryKey,
  stubFetchWithItems,
} from "@/tests/samples/command-handler-sample-datas";
import {
  AppTestWrapper,
  testQueryClient,
} from "@/tests/test-utils/AppTestWrapper";
import { waitForCache } from "@/tests/test-utils/tests.functions";
import {
  countFetchCalls,
  getOpenPopoverCommandItemTexts,
  openPopoverByTriggerName,
} from "@/tests/test-utils/vitest-browser.helpers";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

// Render the controller wrapped in a small component that creates the form (hooks must be used in components)
function DegreeModuleControllerWrapper() {
  const form = useForm({
    defaultValues: { skillList: [], skillListDetails: [] },
  });
  return <DegreeModuleController form={form} />;
}

beforeEach(() => {
  // Ensure history.state has idx to avoid errors in Modal when reading history.state.idx
  history.replaceState({ idx: 0 }, "", "/");
  testQueryClient.clear();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DegreeModuleSkill modal UI interaction", () => {
  test("clicking add new opens modal, form validates and POST updates cache and command list", async () => {
    // Stub fetch responses
    stubFetchWithItems();

    // Render and interact with the DOM directly (vitest-browser provides a real browser environment)
    render(
      <AppTestWrapper>
        <DegreeModuleControllerWrapper />
        <AppModals />
      </AppTestWrapper>
    );

    // Open popover (command list) and assert it contains fetched skills
    await openPopoverByTriggerName(/Recherchez une compétence/i);
    await expect
      .poll(() => getOpenPopoverCommandItemTexts().join(" "))
      .toMatch(/FET/i);

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCalls("GET");

    // Click "Add new" inside popover to open the skill creation modal
    await userEvent.click(
      page.getByRole("button", { name: /Ajouter une compétence/i })
    );

    // Modal should open
    await expect
      .element(page.getByText(/Création de nouvelles compétences/i))
      .toBeInTheDocument();

    // Validation: submit should be disabled while form is invalid
    const submitButton = page.getByRole("button", { name: /^Ajouter$/i });
    await expect.element(submitButton).toBeDisabled();

    // Fill form with valid values (use userEvent.fill to trigger real input events)
    const nameInput = page.getByLabelText(/Nom de la compétence/i);
    const codeInput = page.getByLabelText(/^Code$/i);

    // Match the stubbed POST payload/response shape
    await userEvent.fill(nameInput, "new");
    await userEvent.tab();
    await userEvent.fill(codeInput, "NEW");
    // Blur the last field so RHF (mode: onTouched) can compute validity
    await userEvent.tab();

    // Submit valid form
    await expect.element(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    // Modal closes on success
    await expect
      .element(page.getByText(/Création de nouvelles compétences/i))
      .not.toBeInTheDocument();

    // Cache should be updated under the original command queryKey
    const cached = await waitForCache(skillSubQueryKey);
    expect(cached).toEqual([
      {
        groupTitle: "Tous",
        items: expect.arrayContaining([
          expect.objectContaining(skillFetched),
          expect.objectContaining(skillCreated),
        ]),
      },
    ]);

    // Re-open command list and verify it contains the created skill without refetch
    await openPopoverByTriggerName(/Recherchez une compétence/i);
    await expect
      .poll(() => getOpenPopoverCommandItemTexts().join(" "))
      .toMatch(/NEW/i);

    const getCallsAfterCreation = countFetchCalls("GET");
    expect(getCallsAfterCreation).toBe(getCallsBeforeCreation);
  });
});
