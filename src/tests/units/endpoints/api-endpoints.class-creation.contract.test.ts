import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { classCreationInputControllers } from "@/features/class-creation/components/main/forms/class-creation-inputs";

import { describe, expect, it } from "vitest";

// These tests are a regression-safety net:
// - endpoints used by ClassCreation must exist
// - reshapers must produce CommandItem-compatible shapes (id + value)

describe("API_ENDPOINTS contract for class creation", () => {
  it("classCreationInputControllers are wired with apiEndpoint/dataReshapeFn when required", () => {
    // Diploma select (commands + add new)
    const diploma = classCreationInputControllers.find(
      (c) => c.name === "degreeConfigId",
    );
    expect(diploma).toBeTruthy();
    expect(diploma?.useCommands).toBe(true);
    expect(diploma?.apiEndpoint).toBeTruthy();
    expect(diploma?.dataReshapeFn).toBeTruthy();

    // Students search button
    const students = classCreationInputControllers.find(
      (c) => c.name === "students",
    );
    expect(students).toBeTruthy();
    expect(students?.apiEndpoint).toBeTruthy();
    expect(students?.dataReshapeFn).toBeTruthy();

    // Primary teacher button
    const teacher = classCreationInputControllers.find(
      (c) => c.name === "primaryTeacherId",
    );
    expect(teacher).toBeTruthy();
    expect(teacher?.apiEndpoint).toBeTruthy();
    expect(teacher?.dataReshapeFn).toBeTruthy();

    // Tasks template selector: endpoint is a function (depends on selected diploma)
    const tasks = classCreationInputControllers.find((c) => c.name === "tasks");
    expect(tasks).toBeTruthy();
    expect(tasks?.useCommands).toBe(true);
    expect(tasks?.dataReshapeFn).toBeTruthy();
    expect(tasks?.apiEndpoint).toBeTypeOf("function");
  });

  it("DIPLOMAS reshaper provides items with a 'value' for Command", () => {
    const diplomasPayload = {
      BTS: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          degreeLevel: "BTS",
          degreeYear: "2024",
          degreeField: "Informatique",
        },
      ],
    };

    const shaped = API_ENDPOINTS.GET.DIPLOMAS.dataReshape(diplomasPayload);

    // shaped is a proxied array of groups
    expect(Array.isArray(shaped)).toBe(true);
    const group = shaped[0] as any;
    expect(group.groupTitle).toBe("BTS");

    const firstItem = group.items?.[0] as any;
    expect(firstItem).toBeTruthy();
    expect(firstItem.id).toBe("11111111-1111-4111-8111-111111111111");
    // Special behavior: Command expects `.value` even when backend provides other keys
    expect(firstItem.value).toBe("BTS 2024");
  });

  it("STUDENTS/TEACHERS reshapers provide 'value' and 'name'", () => {
    const studentsPayload = [
      {
        id: "22222222-2222-4222-8222-222222222222",
        firstName: "Alice",
        lastName: "Doe",
        img: "",
      },
    ];

    const teachersPayload = [
      {
        id: "33333333-3333-4333-8333-333333333333",
        firstName: "Bob",
        lastName: "Smith",
        img: "",
      },
    ];

    const shapedStudents = API_ENDPOINTS.GET.STUDENTS.dataReshape(
      studentsPayload as any,
    );
    const shapedTeachers = API_ENDPOINTS.GET.TEACHERS.dataReshape(
      teachersPayload as any,
    );

    const student = (shapedStudents as any)[0].items?.[0];
    expect(student.value).toBe("Alice Doe");
    expect(student.name).toBe("Alice Doe");

    const teacher = (shapedTeachers as any)[0].items?.[0];
    expect(teacher.value).toBe("Bob Smith");
    expect(teacher.name).toBe("Bob Smith");
  });

  it("TASKSTEMPLATES reshaper provides items with a 'value' for Command", () => {
    const taskTemplatesPayload = {
      taskTemplates: [
        {
          id: "44444444-4444-4444-8444-444444444444",
          task: {
            id: "55555555-5555-5555-5555-555555555555",
            name: "Exercice 1",
            description: "Addition",
          },
        },
      ],
      shortTemplatesList: [],
    };

    const shaped = API_ENDPOINTS.GET.TASKSTEMPLATES.dataReshape(
      taskTemplatesPayload as any,
    );

    expect(Array.isArray(shaped)).toBe(true);
    const group = (shaped as any)[0];
    expect(group.groupTitle).toBe("Tous");

    const firstItem = group.items?.[0] as any;
    expect(firstItem).toBeTruthy();
    expect(firstItem.id).toBe("44444444-4444-4444-8444-444444444444");
    expect(firstItem.value).toBe("Exercice 1");
  });
});
