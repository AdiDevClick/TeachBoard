import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type ClassCreation from "@/features/class-creation/components/main/ClassCreation.tsx";

const year = new Date().getFullYear();
const defaultSchoolYear = year + " - " + (year + 1);

export const classCreationInputControllers = [
  {
    name: "name",
    title: "Nom",
    type: "text",
    placeholder: "Unique nom (ex: 1A, 2B, ...)",
    apiEndpoint: API_ENDPOINTS.GET.CLASSES.endPoints.CHECK_NAME,
    // onValueChange can be provided here if you want to run a handler while
    // the user is typing.  the callback will be executed after the value has
    // been pushed to the form control (see AppInputControllerInterface docs).
    // onValueChange: (value) => { console.log("name changed", value); },
  },
  {
    name: "description",
    title: "Description (optionnelle)",
    type: "text",
    placeholder: "Description de la classe",
    required: false,
  },
  {
    // id: "fetch-input-tasks-templates",
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
  },
  {
    // Required for withController to be able to process the field
    // id: "add-new-diploma",
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
  },
  {
    // Required for withController to be able to process the field
    // The "students" field can hold an array of selected student ids (or similar)
    name: "students",
    label: "Elèves",
    type: "button",
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
    type: "button",
    toolTipText: "Ajouter un professeur principal",
    creationButtonText: "Ajoutez un professeur principal",
    // useButtonAddNew: true,
    dataReshapeFn: API_ENDPOINTS.GET.TEACHERS.dataReshape,
    apiEndpoint: API_ENDPOINTS.GET.TEACHERS.endpoint,
  },
  {
    name: "schoolYear",
    label: "Année scolaire",
    task: "add-school-year",
    type: "text",
    placeholder: defaultSchoolYear,
    defaultValue: defaultSchoolYear,
    creationButtonText: false,
    useCommands: false,
    fullWidth: false,
    useButtonAddNew: false,
  },
] satisfies Parameters<typeof ClassCreation>[0]["inputControllers"];
