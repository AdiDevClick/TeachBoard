import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES, type AppModalNames } from "@/configs/app.config.ts";
import {
  ClassFixtureCreator,
  CreateClassResponseFixtureCreator,
  CreateDegreeResponseFixtureCreator,
  CreateTaskTemplateResponseFixtureCreator,
  DegreeFixtureCreator,
  DiplomaConfigFixtureCreator,
  SkillFixtureCreator,
  SkillsViewFixtureCreator,
  StudentFixtureCreator,
  TaskFixtureCreator,
  TaskTemplateFixtureCreator,
  TaskTemplatesFetchFixtureCreator,
  TeacherFixtureCreator,
} from "@/utils/FixtureCreator";

export const degreeFieldModal: AppModalNames = "new-degree-item-field";
export const degreeYearModal: AppModalNames = "new-degree-item-year";
export const degreeLevelModal: AppModalNames = "new-degree-item-degree";
export const diplomaModal: AppModalNames = "create-diploma";
export const taskModal: AppModalNames = "new-task-item";
export const taskTemplateModal: AppModalNames = "new-task-template";
export const classCreationModal: AppModalNames = "class-creation";

// Generic command-handler samples (kept here as single source of truth)
export const moduleModal: AppModalNames = "new-task-module";
export const skillModuleModal: AppModalNames = "new-degree-module-skill";
export const skillFetchActivity = USER_ACTIVITIES.fetchModulesSkills;
export const skillApiEndpoint = "/api/skills" as const;
export const skillQueryKey = [skillModuleModal, skillApiEndpoint] as const;
export const skillQueryKeySingle = [
  skillFetchActivity,
  skillApiEndpoint,
] as const;

// Degree module controller uses the SUBSKILLS endpoint (see API_ENDPOINTS.GET.SKILLS.endPoints.SUBSKILLS)

export const skillFetched = new SkillFixtureCreator({
  name: "fetched-item",
});

export const skillCreated = new SkillFixtureCreator({ name: "new" });
export const classesEndpoint = API_ENDPOINTS.GET.CLASSES.endPoints.ALL;

export const degreeFieldFetched = new DegreeFixtureCreator("FIELD");

export const degreeFieldFetched2 = new DegreeFixtureCreator("FIELD");

// Make YEARS deterministic so diploma switching tests don't randomly collide on the same year (e.g. both "2A").
export const degreeYearFetched = new DegreeFixtureCreator("YEAR", {
  yearNumber: 2,
});

export const degreeYearFetched2 = new DegreeFixtureCreator("YEAR", {
  yearNumber: 3,
});

export const degreeLevelFetched = new DegreeFixtureCreator("LEVEL");

export const degreeLevelFetched2 = new DegreeFixtureCreator("LEVEL");

export const degreeCreated = new DegreeFixtureCreator("FIELD");

export const degreeCreatedResponse = new CreateDegreeResponseFixtureCreator({
  degree: degreeCreated,
});

export const diplomaFetchedSkills = [new SkillsViewFixtureCreator()];

// A second set of skills for another diploma used in tests to ensure
// diploma-specific skills are handled correctly.
export const diplomaFetchedSkills2 = [new SkillsViewFixtureCreator()];

export const diplomaFetched = new DiplomaConfigFixtureCreator({
  degreeField: degreeFieldFetched.name,
  degreeLevel: degreeLevelFetched.name,
  degreeYear: degreeYearFetched.code,
  modules: diplomaFetchedSkills,
});

export const diplomaFetched2 = new DiplomaConfigFixtureCreator({
  degreeField: degreeFieldFetched.name,
  degreeLevel: degreeLevelFetched.name,
  degreeYear: degreeYearFetched2.code,
  modules: diplomaFetchedSkills2,
});

export const diplomaCreated = new DiplomaConfigFixtureCreator({
  degreeField: degreeFieldFetched.name,
  degreeLevel: degreeLevelFetched.name,
  degreeYear: "2A",
});

export const taskFetched = new TaskFixtureCreator();

export const taskFetched2 = new TaskFixtureCreator();

export const taskFetched3 = new TaskFixtureCreator();

export const taskFetched4 = new TaskFixtureCreator();

export const taskCreated = new TaskFixtureCreator();

export const taskTemplateFetched = new TaskTemplateFixtureCreator({
  task: taskFetched,
});

export const taskTemplateFetched2 = new TaskTemplateFixtureCreator({
  task: taskFetched2,
});

export const taskTemplateFetched3 = new TaskTemplateFixtureCreator({
  task: taskFetched3,
});

export const taskTemplateFetched4 = new TaskTemplateFixtureCreator({
  task: taskFetched4,
});

export const taskTemplateFetch = new TaskTemplatesFetchFixtureCreator({
  taskTemplates: [
    taskTemplateFetched,
    taskTemplateFetched2,
    taskTemplateFetched3,
    taskTemplateFetched4,
  ],
  shortTemplatesList: ["short-1", "short-2"],
});

export const taskTemplateCreated = new CreateTaskTemplateResponseFixtureCreator(
  {
    task: taskCreated,
  },
);

export const classFetched = new ClassFixtureCreator({
  degreeLevel: degreeLevelFetched.name,
});

export const classFetched2 = new ClassFixtureCreator({
  degreeLevel: degreeLevelFetched.name,
});

export const classCreated = new CreateClassResponseFixtureCreator({
  degreeLevel: degreeLevelFetched.name,
});

export const studentFetched = new StudentFixtureCreator();

export const studentFetched2 = new StudentFixtureCreator();

export const teacherFetched = new TeacherFixtureCreator();

export const teacherFetched2 = new TeacherFixtureCreator();

export const skillsModulesFetched = {
  Skills: [
    new SkillFixtureCreator({
      code: diplomaFetchedSkills[0].code,
      name: diplomaFetchedSkills[0].name,
      type: "MAIN",
    }),
    new SkillFixtureCreator({
      code: diplomaFetchedSkills2[0].code,
      name: diplomaFetchedSkills2[0].name,
      type: "MAIN",
    }),
  ],
} as const;
