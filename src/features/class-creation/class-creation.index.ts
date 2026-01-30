export { default as DegreeItem } from "./components/DegreeItem/DegreeItem";
export { default as DegreeModule } from "./components/DegreeModule/DegreeModule";
export { default as DegreeModuleSkill } from "./components/DegreeModuleSkill/DegreeModuleSkill";
export { default as DiplomaCreation } from "./components/DiplomaCreation/DiplomaCreation";
export { default as ClassCreation } from "./components/main/ClassCreation";
export { default as SearchStudents } from "./components/SearchStudents/SearchStudents";
export { SearchPrimaryTeacher } from "./components/SearchTeachers/SearchTeachers";
export { default as TaskItem } from "./components/TaskItem/TaskItem";
export { default as TaskTemplateCreation } from "./components/TaskTemplateCreation/TaskTemplateCreation";

// Centralized exports for common feature assets (forms, models, functions, types)
export * from "./components/DegreeItem/forms/degree-item-inputs";
export * from "./components/DiplomaCreation/forms/diploma-creation-inputs";
export * from "./components/main/forms/class-creation-inputs";
export * from "./components/main/functions/class-creation.functions";
export * from "./components/main/models/class-creation.models";
export * from "./components/main/types/class-creation.types";
export * from "./components/TaskTemplateCreation/forms/task-template-inputs";
