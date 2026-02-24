import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { SearchPrimaryTeacher } from "@/features/class-creation/components/SearchTeachers/SearchTeachers.tsx";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { teacherFetched } from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { rx, stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

let mainForm: any = null;

function SearchPrimaryTeacherHost() {
  const f = useForm({
    defaultValues: { primaryTeacherId: "", primaryTeacherValue: "" },
  });
  // expose form for assertions
  mainForm = f;

  return <SearchPrimaryTeacher form={f} modalMode={false} />;
}

setupUiTestState(
  <AppTestWrapper>
    <SearchPrimaryTeacherHost />
  </AppTestWrapper>,
  {
    beforeEach: () =>
      stubFetchRoutes({
        getRoutes: [[API_ENDPOINTS.GET.TEACHERS.endpoint, [teacherFetched]]],
        defaultGetPayload: [],
      }),
  },
);

afterEach(() => vi.unstubAllGlobals());

describe("UI flow: search teachers controller", () => {
  test("displays fetched teachers and allows selection", async () => {
    // The controller will trigger a GET on mount and render the command items (role=option)
    const teacherLabel = `${teacherFetched.firstName} ${teacherFetched.lastName}`;

    await expect.element(page.getByText(rx(teacherLabel))).toBeInTheDocument();

    // Select the teacher by clicking the option text
    await page.getByText(rx(teacherLabel)).click();

    // Assert that the main form got the teacher id set
    await expect
      .poll(() => mainForm.getValues("primaryTeacherId"), { timeout: 1000 })
      .toEqual(teacherFetched.id);
  });
});
