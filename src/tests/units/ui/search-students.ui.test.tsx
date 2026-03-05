import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import SearchStudents from "@/features/class-creation/components/SearchStudents/SearchStudents.tsx";
import type { ClassCreationExtendedFormSchema } from "@/features/class-creation/components/main/types/class-creation.types";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import {
  studentFetched,
  studentFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { rx, stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mainForm: any = null;

function SearchStudentsHost() {
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
  mainForm = f;

  return <SearchStudents form={f} modalMode={false} />;
}

setupUiTestState(
  <AppTestWrapper>
    <SearchStudentsHost />
  </AppTestWrapper>,
  {
    beforeEach: () =>
      stubFetchRoutes({
        getRoutes: [
          [
            API_ENDPOINTS.GET.STUDENTS.endpoint,
            [studentFetched, studentFetched2],
          ],
        ],
        defaultGetPayload: [],
      }),
  },
);

afterEach(() => vi.unstubAllGlobals());

describe("UI flow: search students controller", () => {
  test("displays fetched students and allows selection", async () => {
    const studentLabel = `${studentFetched.firstName} ${studentFetched.lastName}`;

    await expect.element(page.getByText(rx(studentLabel))).toBeInTheDocument();

    await page.getByText(rx(studentLabel)).click();

    await expect
      .poll(() => mainForm?.getValues("students") as string[], {
        timeout: 1000,
      })
      .toContain(studentFetched.id);
  });

  test("supports multi-selection", async () => {
    const label1 = `${studentFetched.firstName} ${studentFetched.lastName}`;
    const label2 = `${studentFetched2.firstName} ${studentFetched2.lastName}`;

    await page.getByText(rx(label1)).click();
    await page.getByText(rx(label2)).click();

    await expect
      .poll(() => mainForm?.getValues("students") as string[], {
        timeout: 1000,
      })
      .toHaveLength(2);
  });

  test("re-selection après réouverture — la sélection est conservée", async () => {
    const label1 = `${studentFetched.firstName} ${studentFetched.lastName}`;

    // Première sélection
    await page.getByText(rx(label1)).click();

    await expect
      .poll(() => mainForm?.getValues("students") as string[], {
        timeout: 1000,
      })
      .toContain(studentFetched.id);

    // Simule une réouverture : déselectionne en re-cliquant
    await page.getByText(rx(label1)).click();

    await expect
      .poll(() => mainForm?.getValues("students") as string[], {
        timeout: 1000,
      })
      .not.toContain(studentFetched.id);

    // Re-sélection : doit à nouveau refléter l'état sélectionné
    await page.getByText(rx(label1)).click();

    await expect
      .poll(() => mainForm?.getValues("students") as string[], {
        timeout: 1000,
      })
      .toContain(studentFetched.id);
  });
});
