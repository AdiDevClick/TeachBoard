import { SearchPrimaryTeacherController } from "@/components/ClassCreation/teachers/controller/SearchTeachersController.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { teacherFetched } from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { rx, stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

let mainForm: any = null;
let localForm: any = null;

function Wrapper() {
  const f = useForm({
    defaultValues: { primaryTeacherId: "", primaryTeacherValue: "" },
  });
  const local = useForm({ defaultValues: { primaryTeacherId: "" } });
  // expose forms for assertions
  mainForm = f;
  localForm = local;

  return (
    <SearchPrimaryTeacherController
      pageId="search-primaryteacher"
      form={f}
      localForm={local}
      formId="search-primaryteacher-form"
    />
  );
}

import { AppTestWrapper } from "@/tests/components/AppTestWrapper";

setupUiTestState(
  <AppTestWrapper>
    <Wrapper />
  </AppTestWrapper>,
  {
    beforeEach: () =>
      stubFetchRoutes({
        getRoutes: [[API_ENDPOINTS.GET.TEACHERS.endpoint, [teacherFetched]]],
        defaultGetPayload: [],
      }),
  }
);

afterEach(() => vi.unstubAllGlobals());

describe("UI flow: search teachers controller", () => {
  test("displays fetched teachers and allows selection", async () => {
    // The controller will trigger a GET on mount and render the command items (role=option)
    const teacherLabel = `${teacherFetched.firstName} ${teacherFetched.lastName}`;

    await expect
      .element(page.getByRole("option", { name: rx(teacherLabel) }))
      .toBeInTheDocument();

    // Select the teacher by clicking the option
    await page.getByRole("option", { name: rx(teacherLabel) }).click();

    // Assert that the main form got the teacher id set
    await expect
      .poll(() => mainForm.getValues("primaryTeacherId"), { timeout: 1000 })
      .toEqual(teacherFetched.id);
  });
});
