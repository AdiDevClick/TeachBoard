import { useDisabledForSubmit } from "@/hooks/useDisabledForSubmit";
import type { FieldValues, FormState } from "react-hook-form";
import { describe, expect, test } from "vitest";
import { renderHook } from "vitest-browser-react";

const baseFormState = {
  isDirty: false,
  isLoading: false,
  isSubmitted: false,
  isSubmitSuccessful: false,
  isSubmitting: false,
  isValidating: false,
  isValid: true,
  disabled: false,
  submitCount: 0,
  defaultValues: undefined,
  dirtyFields: {},
  touchedFields: {},
  validatingFields: {},
  errors: {},
  isReady: true,
} satisfies FormState<FieldValues>;

describe("useDisabledForSubmit", () => {
  test("does not crash when forceSubscribe is enabled without a control", async () => {
    let currentFormState = baseFormState;

    const hook = await renderHook(() =>
      useDisabledForSubmit(currentFormState, { forceSubscribe: true }),
    );

    expect(hook.result.current).toBe(false);

    currentFormState = {
      ...baseFormState,
      isValid: false,
    };

    hook.rerender();

    expect(hook.result.current).toBe(true);
  });
});