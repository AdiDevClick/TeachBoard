import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { SearchPrimaryTeacher } from "@/features/class-creation/components/SearchTeachers/SearchTeachers.tsx";
import type { ClassCreationExtendedFormSchema } from "@/features/class-creation/components/main/types/class-creation.types";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import {
  teacherFetched,
  teacherFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { rx, stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mainForm: any = null;

function SearchPrimaryTeacherHost() {
  const f = useForm<ClassCreationExtendedFormSchema>({
    defaultValues: {
      name: "",
      description: "",
      schoolYear: "",
      students: [],
      degreeConfigId: "",
      userId: "",
      primaryTeacherId: "",
      tasks: [],
      studentsValues: [],
      primaryTeacherValue: [],
    },
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
        getRoutes: [
          [
            API_ENDPOINTS.GET.TEACHERS.endpoint,
            [teacherFetched, teacherFetched2],
          ],
        ],
        defaultGetPayload: [],
      }),
  },
);

afterEach(() => vi.unstubAllGlobals());

describe("UI flow: search teachers controller", () => {
  test("displays fetched teachers and allows selection", async () => {
    const teacherLabel = `${teacherFetched.firstName} ${teacherFetched.lastName}`;

    await expect.element(page.getByText(rx(teacherLabel))).toBeInTheDocument();

    await page.getByText(rx(teacherLabel)).click();

    await expect
      .poll(() => mainForm?.getValues("primaryTeacherId"), { timeout: 1000 })
      .toEqual(teacherFetched.id);
  });

  test("re-sélection après déselection — la sélection est bien remplacée", async () => {
    const label1 = `${teacherFetched.firstName} ${teacherFetched.lastName}`;
    const label2 = `${teacherFetched2.firstName} ${teacherFetched2.lastName}`;

    // Première sélection
    await page.getByText(rx(label1)).click();

    await expect
      .poll(() => mainForm?.getValues("primaryTeacherId"), { timeout: 1000 })
      .toEqual(teacherFetched.id);

    // Changement de sélection : doit remplacer le précédent enseignant
    await page.getByText(rx(label2)).click();

    await expect
      .poll(() => mainForm?.getValues("primaryTeacherId"), { timeout: 1000 })
      .toEqual(teacherFetched2.id);
  });
});
