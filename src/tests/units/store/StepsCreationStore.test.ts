import { useStepsCreationStore } from "@/hooks/store/StepsCreationStore";
import { beforeEach, describe, expect, it } from "vitest";

describe("StepsCreationStore - students reshape", () => {
  beforeEach(() => {
    // reset relevant parts of the store
    useStepsCreationStore.setState({
      students: null,
      tasks: null,
      selectedClass: null,
    });
  });

  it("getStudentsPresenceSelectionData returns mapped fields and items", () => {
    const studentsPayload = [{ id: "1", firstName: "John", lastName: "Stud" }];

    const templates = [{ id: "t1", taskName: "T1", skills: [] }];

    // Populate store
    useStepsCreationStore.getState().setStudents(studentsPayload as any);
    useStepsCreationStore.getState().setClassTasks(templates as any);

    const result = useStepsCreationStore
      .getState()
      .getStudentsPresenceSelectionData();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].title).toBe("John Stud");
    expect(result[0].isSelected).toBe(false);
    expect(result[0].items[0].name).toBe("T1");
  });
});
