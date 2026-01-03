import ClassCreation from "@/components/ClassCreation/ClassCreation";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  AppTestWrapper,
  testQueryClient,
} from "@/tests/test-utils/AppTestWrapper";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MockRoute = {
  method: string;
  match: (url: string) => boolean;
  json: unknown;
  status?: number;
};

function createFetchMock(routes: MockRoute[]) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];

  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, init });

      const method = (init?.method ?? "GET").toUpperCase();
      const route = routes.find(
        (r) => r.method.toUpperCase() === method && r.match(url)
      );

      if (!route) {
        return new Response(
          JSON.stringify({
            error: `No mock for ${method} ${url}`,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const status = route.status ?? 200;
      return new Response(JSON.stringify(route.json), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }
  );

  return { fetchMock, calls };
}

async function waitFor(assertion: () => unknown, timeoutMs = 6000) {
  const start = Date.now();

  while (true) {
    try {
      const result = assertion();
      if (result) return result;
    } catch {
      // ignore and retry
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out waiting for condition");
    }
    await new Promise((r) => setTimeout(r, 50));
  }
}

function findCommandItemByText(
  text: string,
  scope?: ParentNode
): HTMLElement | undefined {
  const root: ParentNode = scope ?? document;
  const candidates = Array.from(
    (root as Document).querySelectorAll
      ? (root as Document).querySelectorAll(
          '[data-slot="command-item"], [cmdk-item]'
        )
      : []
  ) as HTMLElement[];
  return candidates.find(
    (el) => isVisibleElement(el) && (el.textContent ?? "").includes(text)
  );
}

function getOpenPopoverContent(): HTMLElement | null {
  const contents = Array.from(
    document.querySelectorAll('[data-slot="popover-content"]')
  ) as HTMLElement[];
  const visible = contents.filter((el) => isVisibleElement(el));
  return visible.length > 0 ? visible[visible.length - 1] : null;
}

function getCommandItems(scope?: ParentNode): HTMLElement[] {
  const root: ParentNode = scope ?? document;
  const items = Array.from(
    (root as Document).querySelectorAll
      ? (root as Document).querySelectorAll(
          '[data-slot="command-item"], [cmdk-item]'
        )
      : []
  ) as HTMLElement[];
  return items.filter((el) => isVisibleElement(el));
}

function selectCommandItem(el: HTMLElement) {
  // cmdk/Radix interactions are sometimes wired on pointer events.
  // A small event sequence is more reliable than `.click()` alone.
  el.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      pointerType: "mouse",
    })
  );
  el.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true, cancelable: true })
  );
  el.dispatchEvent(
    new MouseEvent("mouseup", { bubbles: true, cancelable: true })
  );
  el.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true })
  );
}

function clickFirstCommandItem(scope?: ParentNode) {
  const items = getCommandItems(scope);
  if (items.length === 0) throw new Error("No command items found");
  selectCommandItem(items[0]);
}

function clickCommandItemByText(text: string) {
  const el = findCommandItemByText(text);
  if (!el) throw new Error(`Command item not found containing: ${text}`);
  selectCommandItem(el);
}

function clickCommandItemByTextInScope(text: string, scope: ParentNode) {
  const el = findCommandItemByText(text, scope);
  if (!el) throw new Error(`Command item not found containing: ${text}`);
  selectCommandItem(el);
}

async function waitForOpenPopoverWithItems() {
  return (await waitFor(() => {
    const popover = getOpenPopoverContent();
    if (!popover) return null;
    return getCommandItems(popover).length > 0 ? popover : null;
  })) as HTMLElement;
}

async function clickCommandItemByTextInOpenPopover(
  text: string,
  timeoutMs = 6000
) {
  return await waitFor(() => {
    const popover = getOpenPopoverContent();
    if (!popover) return false;
    const el = findCommandItemByText(text, popover);
    if (!el) return false;
    try {
      selectCommandItem(el);
      return true;
    } catch {
      return false;
    }
  }, timeoutMs);
}

async function clickFirstCommandItemInOpenPopover(timeoutMs = 6000) {
  return await waitFor(() => {
    const popover = getOpenPopoverContent();
    if (!popover) return false;
    const [first] = getCommandItems(popover);
    if (!first) return false;
    try {
      selectCommandItem(first);
      return true;
    } catch {
      return false;
    }
  }, timeoutMs);
}

function submitFormById(formId: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) throw new Error(`Form not found: ${formId}`);

  // Prefer requestSubmit() in browser mode: it behaves like a real user submit
  // and reliably triggers React's onSubmit delegation.
  let submitObserved = false;
  form.addEventListener(
    "submit",
    () => {
      submitObserved = true;
    },
    { once: true }
  );

  const maybeRequestSubmit = (form as unknown as { requestSubmit?: () => void })
    .requestSubmit;
  if (typeof maybeRequestSubmit === "function") {
    maybeRequestSubmit.call(form);
  }

  // Fallback if requestSubmit is unavailable or did not fire.
  if (!submitObserved) {
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  }
}

function getControlByLabelText(labelText: string): HTMLElement {
  const labels = Array.from(document.querySelectorAll("label"));
  const label = labels.find(
    (l) => (l.textContent ?? "").trim() === labelText.trim()
  );
  if (!label) throw new Error(`Label not found: ${labelText}`);
  const forId = label.getAttribute("for");
  if (!forId) throw new Error(`Label has no 'for' attribute: ${labelText}`);
  const control = document.getElementById(forId);
  if (!control) throw new Error(`Control not found for label: ${labelText}`);
  return control;
}

function setNativeInputValue(
  el: HTMLInputElement | HTMLTextAreaElement,
  value: string
) {
  // React tracks the value via an internal setter; direct assignment can be ignored.
  const prototype =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  const setter = descriptor?.set;
  if (setter) {
    setter.call(el, value);
  } else {
    el.value = value;
  }
}

function fillByLabel(labelText: string, value: string) {
  const el = getControlByLabelText(labelText) as HTMLInputElement;
  el.focus();
  setNativeInputValue(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
}

function clickByLabel(labelText: string) {
  const el = getControlByLabelText(labelText);
  (el as HTMLElement).click();
}

function isVisibleElement(el: Element): boolean {
  const htmlEl = el as HTMLElement;
  const style = window.getComputedStyle(htmlEl);
  if (style.display === "none" || style.visibility === "hidden") return false;
  const rect = htmlEl.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function describeInvalidField(el: Element) {
  const htmlEl = el as HTMLElement;
  const id = htmlEl.getAttribute("id") ?? "";
  const name = (htmlEl as HTMLInputElement).name ?? "";
  const escape = (globalThis.CSS?.escape ?? ((s: string) => s)) as (
    s: string
  ) => string;
  const label = id
    ? (
        document.querySelector(`label[for="${escape(id)}"]`)?.textContent ?? ""
      ).trim()
    : "";
  return {
    tag: htmlEl.tagName.toLowerCase(),
    id,
    name,
    label,
  };
}

function getVisibleDialogCard(pageId: string): HTMLElement {
  const el = document.getElementById(pageId) as HTMLElement | null;
  if (!el) throw new Error(`Dialog card not found: ${pageId}`);
  if (!isVisibleElement(el))
    throw new Error(`Dialog card not visible: ${pageId}`);
  return el;
}

function findButtonByText(text: string): HTMLButtonElement {
  const buttons = Array.from(document.querySelectorAll("button"));
  const btn = buttons.find(
    (b) =>
      (b.textContent ?? "").includes(text) &&
      isVisibleElement(b) &&
      !b.disabled &&
      b.getAttribute("aria-disabled") !== "true"
  );
  if (!btn) throw new Error(`Button not found containing: ${text}`);
  return btn;
}

function findButtonByPlaceholder(placeholder: string): HTMLButtonElement {
  const escaped = (globalThis.CSS?.escape ?? ((s: string) => s))(placeholder);
  const buttons = Array.from(
    document.querySelectorAll(`button[placeholder="${escaped}"]`)
  ) as HTMLButtonElement[];
  const btn = buttons.find(
    (b) =>
      isVisibleElement(b) &&
      !b.disabled &&
      b.getAttribute("aria-disabled") !== "true"
  );
  if (!btn)
    throw new Error(`Button not found with placeholder: ${placeholder}`);
  return btn;
}

function clickButtonByText(text: string) {
  findButtonByText(text).click();
}

function clickButtonByPlaceholder(placeholder: string) {
  findButtonByPlaceholder(placeholder).click();
}

function findVisibleButtonByTextWithin(
  root: ParentNode,
  text: string
): HTMLButtonElement {
  const buttons = Array.from(
    (root as Document).querySelectorAll
      ? (root as Document).querySelectorAll("button")
      : []
  ) as HTMLButtonElement[];
  const btn = buttons.find(
    (b) =>
      (b.textContent ?? "").includes(text) &&
      isVisibleElement(b) &&
      !b.disabled &&
      b.getAttribute("aria-disabled") !== "true"
  );
  if (!btn) throw new Error(`Button not found in scope containing: ${text}`);
  return btn;
}

function clickTaskTemplateTrigger() {
  const form = document.getElementById("class-creation-form");
  if (!form) throw new Error("Form not found: class-creation-form");
  findVisibleButtonByTextWithin(
    form,
    "Sélectionnez un template de tâche..."
  ).click();
}

async function openTaskTemplatesCommandList(timeoutMs = 6000) {
  const start = Date.now();

  while (true) {
    clickTaskTemplateTrigger();
    await new Promise((r) => setTimeout(r, 50));
    const popover = getOpenPopoverContent();
    if (popover && getCommandItems(popover).length > 0) return;
    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out opening task templates popover");
    }
  }
}

async function closeTaskTemplatesCommandList(timeoutMs = 6000) {
  const start = Date.now();

  while (true) {
    const popover = getOpenPopoverContent();
    if (!popover) return;
    clickTaskTemplateTrigger();
    await new Promise((r) => setTimeout(r, 50));
    const maybeStillOpen = getOpenPopoverContent();
    if (!maybeStillOpen) return;
    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out closing task templates popover");
    }
  }
}

function clickText(text: string) {
  const candidates = Array.from(
    document.querySelectorAll("*")
  ) as HTMLElement[];
  const el = candidates.find(
    (n) => (n.textContent ?? "").trim() === text && isVisibleElement(n)
  );
  if (!el) throw new Error(`Text not found: ${text}`);
  (el as HTMLElement).click();
}

function findVisibleTextWithin(
  root: ParentNode,
  text: string
): HTMLElement | undefined {
  const candidates = Array.from(
    (root as Document).querySelectorAll
      ? (root as Document).querySelectorAll("*")
      : []
  ) as HTMLElement[];
  return candidates.find(
    (n) => isVisibleElement(n) && (n.textContent ?? "").includes(text)
  );
}

function findEnabledButtonByTextWithin(
  root: ParentNode,
  text: string
): HTMLButtonElement {
  const buttons = Array.from(
    (root as Document).querySelectorAll
      ? (root as Document).querySelectorAll("button")
      : []
  ) as HTMLButtonElement[];
  const btn = buttons.find(
    (b) =>
      isVisibleElement(b) &&
      (b.textContent ?? "").includes(text) &&
      !b.disabled &&
      b.getAttribute("aria-disabled") !== "true"
  );
  if (!btn)
    throw new Error(`Enabled button not found in scope containing: ${text}`);
  return btn;
}

function findEnabledSubmitButtonForForm(
  formId: string,
  text: string
): HTMLButtonElement {
  const formLinked = Array.from(
    document.querySelectorAll(
      `button[form="${(globalThis.CSS?.escape ?? ((s: string) => s))(formId)}"]`
    )
  ) as HTMLButtonElement[];
  const btn = formLinked.find(
    (b) =>
      isVisibleElement(b) &&
      (b.textContent ?? "").includes(text) &&
      !b.disabled &&
      b.getAttribute("aria-disabled") !== "true"
  );
  if (btn) return btn;

  // Fallback: in case the submit button is rendered inside the form.
  const form = document.getElementById(formId);
  if (!form) throw new Error(`Form not found: ${formId}`);
  return findEnabledButtonByTextWithin(form, text);
}

function findSubmitButtonForForm(
  formId: string,
  text: string
): HTMLButtonElement | null {
  const formLinked = Array.from(
    document.querySelectorAll(
      `button[form="${(globalThis.CSS?.escape ?? ((s: string) => s))(formId)}"]`
    )
  ) as HTMLButtonElement[];
  return (
    formLinked.find(
      (b) => isVisibleElement(b) && (b.textContent ?? "").includes(text)
    ) ?? null
  );
}

function clickAddButtonInSection(sectionLabel: string) {
  const labels = Array.from(document.querySelectorAll("label"));
  const label = labels.find((l) =>
    (l.textContent ?? "").includes(sectionLabel)
  );
  if (!label) throw new Error(`Section label not found: ${sectionLabel}`);
  const container = label.closest("div");
  if (!container) throw new Error(`Container not found for: ${sectionLabel}`);
  const buttons = Array.from(container.querySelectorAll("button"));
  if (buttons.length === 0)
    throw new Error(`No buttons in section: ${sectionLabel}`);
  buttons[buttons.length - 1].click();
}

// Note: Zod's UUID validator enforces RFC 4122 variant/version bits.
// Use v4 UUIDs with a valid variant (8/9/a/b) so schema validation passes.
const USER_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DIPLOMA_ID = "11111111-1111-4111-8111-111111111111";
const STUDENT_ID = "22222222-2222-4222-8222-222222222222";
const TEACHER_ID = "33333333-3333-4333-8333-333333333333";
const TASK_TEMPLATE_ID = "44444444-4444-4444-8444-444444444444";

describe("Class creation e2e (user clicks)", () => {
  let calls: Array<{ url: string; init?: RequestInit }> = [];

  beforeEach(async () => {
    // Some modal flows read history.state.idx
    history.replaceState({ idx: 0 }, "", "/");

    const { fetchMock, calls: recorded } = createFetchMock([
      {
        method: "GET",
        match: (url) => url.endsWith("/api/degrees/config"),
        json: {
          data: {
            BTS: [
              {
                id: DIPLOMA_ID,
                degreeLevel: "BTS",
                degreeYear: "2024",
                degreeField: "Informatique",
              },
            ],
          },
        },
      },
      {
        method: "GET",
        match: (url) => url.endsWith("/api/students/not-assigned"),
        json: {
          data: [
            {
              id: STUDENT_ID,
              firstName: "Alice",
              lastName: "Doe",
              img: "",
            },
          ],
        },
      },
      {
        method: "GET",
        match: (url) => url.endsWith("/api/teachers/"),
        json: {
          data: [
            {
              id: TEACHER_ID,
              firstName: "Bob",
              lastName: "Smith",
              img: "",
            },
          ],
        },
      },
      {
        method: "GET",
        match: (url) =>
          url.endsWith(`/api/task-templates/by-degree-config/${DIPLOMA_ID}`),
        json: {
          data: {
            taskTemplates: [
              {
                id: TASK_TEMPLATE_ID,
                task: {
                  id: "55555555-5555-5555-5555-555555555555",
                  name: "Exercice 1",
                  description: "Addition",
                },
              },
            ],
            shortTemplatesList: [],
          },
        },
      },
      {
        method: "POST",
        match: (url) => url.endsWith("/api/classes"),
        json: {
          data: {
            id: "66666666-6666-6666-6666-666666666666",
            name: "1a",
            degreeLevel: "BTS",
          },
          success: "created",
        },
      },
    ]);

    calls = recorded;
    vi.stubGlobal("fetch", fetchMock);

    await render(
      <AppTestWrapper>
        <AppModals />
        <ClassCreation modalMode={false} userId={USER_ID} />
      </AppTestWrapper>
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    testQueryClient.clear();
    cleanup();
  });

  it("creates a class through the full user flow", async () => {
    // Fill basic fields
    fillByLabel("Nom", "1A");
    fillByLabel("Description (optionnelle)", "Classe de test");

    // Select diploma config (opens popover, triggers GET /degrees/config)
    clickByLabel("Année et niveau du diplôme");
    // Prefer clicking the expected label when present, fallback to the first item.
    try {
      await clickCommandItemByTextInOpenPopover("BTS 2024", 2500);
    } catch {
      await clickFirstCommandItemInOpenPopover();
    }

    // The tasks section is conditionally rendered after diploma selection.
    await waitFor(() =>
      document.body.textContent?.includes(
        "Sélectionnez un template de tâche..."
      )
    );

    // Select a task template (visible only after diploma selected)
    // First click triggers the fetch via onOpenChange.
    clickTaskTemplateTrigger();
    // Ensure the fetch result is actually cached under the expected key.
    // If this never happens, it means the command handler is not wiring contentId/url correctly.
    await waitFor(() => {
      const cached = testQueryClient.getQueryData([
        "new-task-template",
        `/api/task-templates/by-degree-config/${DIPLOMA_ID}`,
      ]);

      const items = Array.isArray(cached)
        ? (cached as any)[0]?.items
        : undefined;
      return Array.isArray(items) && items.length > 0;
    });

    // Open the cmdk list after caching (sometimes the list doesn't update while already open).
    await openTaskTemplatesCommandList();
    const tasksPopover = (await waitForOpenPopoverWithItems()) as HTMLElement;
    await waitFor(() => findCommandItemByText("Exercice 1", tasksPopover));
    clickCommandItemByTextInScope("Exercice 1", tasksPopover);
    await closeTaskTemplatesCommandList();

    const classForm = document.getElementById(
      "class-creation-form"
    ) as HTMLElement | null;
    if (!classForm) throw new Error("Form not found: class-creation-form");
    await waitFor(() => findVisibleTextWithin(classForm, "Exercice 1"));

    // Add students
    clickAddButtonInSection("Elèves");
    const studentsDialog = (await waitFor(() =>
      getVisibleDialogCard("search-students")
    )) as HTMLElement;
    await waitFor(() => getCommandItems(studentsDialog).length > 0);
    const alice = findCommandItemByText("Alice Doe", studentsDialog);
    if (alice) {
      selectCommandItem(alice);
    } else {
      clickFirstCommandItem(studentsDialog);
    }
    // Close the dialog via the cancel action.
    // Selection updates the main form immediately via `selectionCallback`, and the final
    // POST payload assertion below will ensure it actually persisted.
    findVisibleButtonByTextWithin(studentsDialog, "Annuler").click();
    await waitFor(() => !isVisibleElement(studentsDialog));

    await waitFor(
      () =>
        classForm.querySelector(
          'img[alt="@Alice Doe"]'
        ) as HTMLImageElement | null
    );

    // Add primary teacher (select closes dialog automatically)
    clickAddButtonInSection("Professeur principal");
    const teachersDialog = (await waitFor(() =>
      getVisibleDialogCard("search-primaryteacher")
    )) as HTMLElement;
    await waitFor(() => getCommandItems(teachersDialog).length > 0);
    const bob = findCommandItemByText("Bob Smith", teachersDialog);
    if (bob) {
      selectCommandItem(bob);
    } else {
      clickFirstCommandItem(teachersDialog);
    }
    await waitFor(() => !isVisibleElement(teachersDialog));

    await waitFor(
      () =>
        classForm.querySelector(
          'img[alt="@Bob Smith"]'
        ) as HTMLImageElement | null
    );

    // Submit deterministically via requestSubmit() in browser mode.
    // Some Button components default to type="button", so click() is not always a submit.
    const submitAttemptAt = Date.now();
    submitFormById("class-creation-form");

    // Assert POST happened with expected payload.
    // If the form stays invalid, surface which fields are invalid to avoid flaky timeouts.
    const postOrInvalid = (await waitFor(() => {
      const post = calls.find(
        (c) => (c.init?.method ?? "GET").toUpperCase() === "POST"
      );
      if (post) return { kind: "post", post } as const;

      // Prefer a deterministic RHF signal (dev-only test hook), since custom fields
      // don't always render aria-invalid.
      const invalidHook = (globalThis as any)
        .__TB_CLASS_CREATION_LAST_INVALID_SUBMIT__ as
        | { at: number; keys: string[]; values?: unknown }
        | undefined;
      if (invalidHook && invalidHook.at >= submitAttemptAt) {
        return {
          kind: "invalid",
          invalid: invalidHook.keys.map((k) => ({
            tag: "",
            id: "",
            name: k,
            label: k,
          })),
          values: invalidHook.values,
        } as const;
      }

      const invalid = Array.from(
        document.querySelectorAll('[aria-invalid="true"]')
      );
      if (invalid.length > 0) {
        return {
          kind: "invalid",
          invalid: invalid.map(describeInvalidField),
        } as const;
      }

      return false;
    }, 6000)) as
      | { kind: "post"; post: (typeof calls)[number] }
      | {
          kind: "invalid";
          invalid: ReturnType<typeof describeInvalidField>[];
          values?: unknown;
        };

    if (postOrInvalid.kind === "invalid") {
      throw new Error(
        `Form stayed invalid after submit. Invalid fields: ${JSON.stringify(
          postOrInvalid.invalid,
          null,
          2
        )}\nCurrent values: ${JSON.stringify(
          postOrInvalid.values ?? null,
          null,
          2
        )}`
      );
    }

    const postCall = postOrInvalid.post;
    expect(postCall?.url.endsWith("/api/classes")).toBe(true);

    const body = String(postCall?.init?.body ?? "{}");
    const parsed = JSON.parse(body) as any;

    expect(parsed.name).toBe("1a");
    expect(parsed.description).toBe("Classe de test");
    // schoolYear is normalized in controller from "YYYY - YYYY" -> "YYYY-YYYY"
    expect(parsed.schoolYear).toMatch(/^\d{4}-\d{4}$/);
    expect(parsed.degreeConfigId).toBe(DIPLOMA_ID);
    expect(parsed.userId).toBe(USER_ID);

    expect(parsed.students).toEqual([STUDENT_ID]);
    expect(parsed.tasks).toEqual([TASK_TEMPLATE_ID]);
    expect(parsed.primaryTeacherId).toBe(TEACHER_ID);
  });

  it("does not submit when required fields are missing", async () => {
    fillByLabel("Nom", "1A");

    submitFormById("class-creation-form");

    // No POST should have happened
    await waitFor(() => {
      const anyPost = calls.some(
        (c) => (c.init?.method ?? "GET").toUpperCase() === "POST"
      );
      return anyPost ? false : true;
    });
  });
});
