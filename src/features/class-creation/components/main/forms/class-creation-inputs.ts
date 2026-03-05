import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { ClassCreationInputControllers } from "@/features/class-creation/components/main/types/class-creation.types";

const year = new Date().getFullYear();
const defaultSchoolYear = year + " - " + (year + 1);

/**
 * Input controllers for the two basic text fields (class name + description).
 * Used by `ControlledInputList`.
 */
export const CLASS_CREATION_CONTROLLED_INPUTS_CONTROLLERS = [
  {
    task: "class-name-availability",
    name: "name",
    title: "Nom",
    type: "text",
    placeholder: "Unique nom (ex: 1A, 2B, ...)",
    apiEndpoint: API_ENDPOINTS.GET.CLASSES.endPoints.AVAILABILITY,
  },
  {
    name: "description",
    title: "Description (optionnelle)",
    type: "text",
    placeholder: "Description de la classe",
    required: false,
  },
] satisfies ClassCreationInputControllers["inputs"];

/**
 * Single controller for the dynamic tasks tag list.
 * Used as spread props on `ControlledDynamicTagList` and `PopoverFieldWithCommands`.
 */
export const CLASS_CREATION_DYNAMIC_LIST_CONTROLLERS = {
  apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID,
  dataReshapeFn: API_ENDPOINTS.GET.TASKSTEMPLATES.dataReshape,
  name: "tasks",
  task: "new-task-template",
  title: "Tâches à évaluer",
  type: "text",
  placeholder: "Sélectionnez un template de tâche...",
  useButtonAddNew: true,
  useCommands: true,
  creationButtonText: "Ajouter une tâche",
  multiSelection: true,
} satisfies ClassCreationInputControllers["dynamicList"];

/**
 * Input controllers for the diploma popover field.
 * Used by `PopoverFieldWithControllerAndCommandsList`.
 */
export const CLASS_CREATION_POPOVER_CONTROLLERS = {
  name: "degreeConfigId",
  label: "Année et niveau du diplôme",
  placeholder: "Sélectionnez...",
  creationButtonText: "Ajouter un diplôme",
  task: "create-diploma",
  useCommands: true,
  type: "text",
  fullWidth: true,
  useButtonAddNew: true,
  apiEndpoint: API_ENDPOINTS.GET.DIPLOMAS.endpoint,
  dataReshapeFn: API_ENDPOINTS.GET.DIPLOMAS.dataReshape,
} satisfies ClassCreationInputControllers["popover"];

/**
 * Input controllers for the avatar lists (students + primary teacher).
 * `type: "button"` is kept as the literal so spread into `AvatarsWithLabelAndAddButtonList`
 * remains assignable to `ComponentProps<Button>["type"]`.
 * Used by `AvatarsWithLabelAndAddButtonList` (items are injected at runtime by the hook).
 */
export const CLASS_CREATION_AVATAR_INPUT_CONTROLLERS = [
  {
    name: "students",
    label: "Elèves",
    apiEndpoint: API_ENDPOINTS.GET.STUDENTS.endpoint,
    dataReshapeFn: API_ENDPOINTS.GET.STUDENTS.dataReshape,
    creationButtonText: "Ajouter des élèves",
    toolTipText: "Ajouter des élèves",
    task: "search-students",
  },
  {
    name: "primaryTeacherId",
    label: "Professeur principal",
    task: "search-primaryteacher",
    toolTipText: "Ajouter un professeur principal",
    creationButtonText: "Ajoutez un professeur principal",
    dataReshapeFn: API_ENDPOINTS.GET.TEACHERS.dataReshape,
    apiEndpoint: API_ENDPOINTS.GET.TEACHERS.endpoint,
  },
] satisfies ClassCreationInputControllers["avatar"];

/**
 * Flat array reconstructed from the four groups above (+ schoolYear).
 * Kept for backward-compatibility with `ClassCreation` which passes it as `inputControllers`.
 */
export const CLASS_CREATION_YEAR_SELECTION_CONTROLLERS = {
  name: "schoolYear",
  label: "Année scolaire",
  task: "add-school-year",
  type: "text",
  placeholder: defaultSchoolYear,
  defaultValue: defaultSchoolYear,
  useCommands: false,
  fullWidth: false,
  useButtonAddNew: false,
} satisfies ClassCreationInputControllers["yearSelection"];
