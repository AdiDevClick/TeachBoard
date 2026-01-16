import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore";
import { beforeEach, describe, expect, it } from "vitest";

describe("StepsCreationStore - students reshape", () => {
  beforeEach(() => {
    // reset relevant parts of the store
    useEvaluationStepsCreationStore.setState({
      students: null,
      tasks: null,
      selectedClass: null,
    });
  });

  it("getStudentsPresenceSelectionData returns mapped fields and items", () => {
    const studentsPayload = [{ id: "1", firstName: "John", lastName: "Stud" }];

    const templates = [{ id: "t1", taskName: "T1", modules: [] }];

    // Populate store
    useEvaluationStepsCreationStore
      .getState()
      .setStudents(studentsPayload as any);
    useEvaluationStepsCreationStore.getState().setClassTasks(templates as any);

    const result = useEvaluationStepsCreationStore
      .getState()
      .getStudentsPresenceSelectionData();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].title).toBe("John Stud");
    expect(result[0].isSelected).toBe(false);
    expect(result[0].items[0].name).toBe("T1");
  });
});
