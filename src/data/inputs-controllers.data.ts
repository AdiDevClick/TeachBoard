import type ClassCreation from "@/components/ClassCreation/ClassCreation.tsx";
import type DegreeItem from "@/components/ClassCreation/diploma/degree-item/DegreeItem.tsx";
import type { DegreeModuleSkillController } from "@/components/ClassCreation/diploma/degree-module-skill/controller/DegreeModuleSkillController.tsx";
import type DegreeModule from "@/components/ClassCreation/diploma/degree-module/DegreeModule.tsx";
import type TaskItem from "@/components/ClassCreation/task/task-item/TaskItem";
import type TaskTemplateCreation from "@/components/ClassCreation/task/task-template/TaskTemplateCreation";
import type { InputItem } from "@/components/Inputs/types/inputs.types";
import type LoginForm from "@/components/LoginForms/LoginForm.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { RecoveryFormSchema } from "@/models/login.models.ts";
import type { PasswordCreation } from "@/pages/Password/PasswordCreation.tsx";
import type { Signup } from "@/pages/Signup/Signup.tsx";

/**
 * Input controllers for forms components.
 *
 * @description All arrays MUST be set to `satisfies Parameters<typeof MyFormComponent>[0]["inputControllers"];' to ensure proper typing.
 */

/** Login page controllers  */
export const inputLoginControllers = [
  {
    name: "identifier",
    title: "Identifiant",
    type: "text",
    placeholder: "m@example.com",
    autoComplete: "username",
  },
  {
    name: "password",
    title: "Mot de passe",
    type: "password",
    placeholder: "********",
    autoComplete: "current-password",
  },
] satisfies Parameters<typeof LoginForm>[0]["inputControllers"];

/** Signup page controllers  */
export const inputSignupControllers = [
  {
    name: "email",
    title: "Votre adresse e-mail",
    type: "email",
    placeholder: "m@example.com",
    autoComplete: "email",
  },
  {
    name: "username",
    title: "Votre nom d'utilisateur",
    type: "text",
    placeholder: "John Doe",
    autoComplete: "username",
  },
] satisfies Parameters<typeof Signup>[0]["inputControllers"];

/** Password creation page controllers  */
export const passwordCreationInputControllers = [
  {
    name: "password",
    title: "Nouveau mot de passe",
    type: "password",
    placeholder: "********",
  },
  {
    name: "passwordConfirmation",
    title: "Confirmer le mot de passe",
    type: "password",
    placeholder: "********",
  },
] satisfies Parameters<typeof PasswordCreation>[0]["inputControllers"];

/** Password recovery page controllers  */
export const passwordRecoveryInputControllers = [
  {
    name: "identifier",
    title: "Votre adresse e-mail",
    type: "email",
    placeholder: "m@example.com",
    autoComplete: "email",
  },
] satisfies InputItem<RecoveryFormSchema>[];

const year = new Date().getFullYear();
const defaultSchoolYear = year + " - " + (year + 1);
export const classCreationInputControllers = [
  {
    name: "name",
    title: "Nom",
    type: "text",
    placeholder: "Unique nom (ex: 1A, 2B, ...)",
  },
  {
    name: "description",
    title: "Description (optionnelle)",
    type: "text",
    placeholder: "Description de la classe",
  },
  {
    id: "fetch-input-tasks-templates",
    apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID,
    dataReshapeFn: API_ENDPOINTS.GET.TASKSTEMPLATES.dataReshape,
    name: "taskId",
    task: "new-task-template",
    title: "Tâches à évaluer",
    placeholder: "Sélectionnez un template de tâche...",
    useButtonAddNew: true,
    useCommands: true,
    creationButtonText: "Ajouter une tâche",
  },
  // {
  //   name: "schoolYear",
  //   title: "Année scolaire",
  //   type: "button",
  //   placeholder: "Sélectionnez l'année scolaire",
  //   autoComplete: "off",
  // },
  {
    // Required for withController to be able to process the field
    id: "add-new-diploma",
    name: "degreeConfigId",
    label: "Année et niveau du diplôme",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un diplôme",
    task: "create-diploma",
    useCommands: true,
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
    task: "add-students",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter des élèves",
    useCommands: false,
    fullWidth: true,
    useButtonAddNew: true,
  },
  {
    name: "schoolYear",
    label: "Année scolaire",
    task: "add-school-year",
    placeholder: defaultSchoolYear,
    defaultValue: defaultSchoolYear,
    creationButtonText: false,
    useCommands: false,
    fullWidth: false,
    useButtonAddNew: false,
  },
] satisfies Parameters<typeof ClassCreation>[0]["inputControllers"];

export const degreeCreationInputControllersDegree = [
  {
    name: "name",
    title: "Nom du diplôme",
    type: "text",
    placeholder: "Ex: Brevet des collèges, Bac Pro, ...",
  },
  {
    name: "code",
    title: "Code du diplôme",
    type: "text",
    placeholder: "Ex: BTS, BACPRO, ...",
  },
  {
    name: "description",
    title: "Description (optionnelle)",
    type: "text",
    placeholder: "Description du diplôme. Ex: Niveau 4, RNCP5, ...",
    required: false,
  },
] satisfies Parameters<typeof DegreeItem>[0]["inputControllers"];
export const degreeCreationInputControllersField = [
  {
    name: "name",
    title: "Nom du métier / domaine",
    type: "text",
    placeholder: "Ex: Cuisine, Prothésiste Dentaire...",
  },
  {
    name: "code",
    title: "Code du métier / domaine",
    type: "text",
    placeholder: "Ex: CUISINE, PROTHDENT...",
  },
  {
    name: "description",
    title: "Description (optionnelle)",
    type: "text",
    placeholder:
      "Description du métier / domaine. Ex: Métiers de la cuisine...",
    required: false,
  },
] satisfies Parameters<typeof DegreeItem>[0]["inputControllers"];
export const degreeCreationInputControllersYear = [
  {
    name: "name",
    title: "Année scolaire du diplôme",
    type: "text",
    placeholder: "Ex: Première année, Deuxième année...",
  },
  {
    name: "code",
    title: "Code de l'année",
    type: "text",
    placeholder: "Ex: 1A, 2A...",
  },
  {
    name: "description",
    title: "Description (optionnelle)",
    type: "text",
    placeholder:
      "Description de l'année scolaire. Ex: Représente la première année du diplôme...",
    required: false,
  },
] satisfies Parameters<typeof DegreeItem>[0]["inputControllers"];

export const degreeModuleCreationInputControllers = [
  {
    name: "name",
    title: "Nom du module",
    type: "text",
    placeholder: "Ex: Mettre en place une infrastructure réseau...",
  },
  {
    name: "code",
    title: "Code",
    type: "text",
    placeholder: "Ex: C7, G90...",
  },
  {
    id: "fetch-input-skills",
    apiEndpoint: API_ENDPOINTS.GET.SKILLS.endPoints.SUBSKILLS,
    dataReshapeFn: API_ENDPOINTS.GET.SKILLS.dataReshape,
    task: "new-degree-module-skill",
    name: "skillList",
    title: "Compétences",
    type: "text",
    useButtonAddNew: true,
    creationButtonText: "Ajouter une compétence",
    useCommands: true,
    placeholder: "Recherchez une compétence...",
  },
] satisfies Parameters<typeof DegreeModule>[0]["inputControllers"];

export const degreeSubSkillsCreationInputControllers = [
  {
    name: "name",
    title: "Nom de la compétence",
    type: "text",
    placeholder: "Ex: Installer un switch manageable...",
  },
  {
    name: "code",
    title: "Code",
    type: "text",
    placeholder: "Ex: S1, A23...",
  },
] satisfies Parameters<
  typeof DegreeModuleSkillController
>[0]["inputControllers"];

export const taskTemplateCreationInputControllers = [
  {
    name: "name",
    title: "Nom de la configuration",
    type: "text",
    placeholder: "Ex: BTS Cuisine - Serveur...",
  },
  {
    name: "description",
    title: "Description",
    type: "text",
    placeholder: "Ex: La tâche consiste à ...",
  },
  {
    id: "fetch-input-tasks",
    name: "degreeConfigId",
    title: "Diplôme associé",
    type: "text",
    placeholder: "Sélectionnez le diplôme associé...",
  },
  {
    id: "fetch-input-tasks",
    apiEndpoint: API_ENDPOINTS.GET.TASKS.endpoint,
    dataReshapeFn: API_ENDPOINTS.GET.TASKS.dataReshape,
    name: "taskId",
    task: "new-task-item",
    label: "Tâche",
    type: "text",
    placeholder: "Sélectionnez un nom...",
    useButtonAddNew: true,
    creationButtonText: "Ajouter une tâche",
    useCommands: true,
  },
  {
    id: "fetch-input-skills-for-tasks",
    multiSelection: true,
    // apiEndpoint: API_ENDPOINTS.GET.SKILLS.endPoints.SUBSKILLS,
    // dataReshapeFn: API_ENDPOINTS.GET.SKILLS.dataReshape,
    task: "new-task-skill",
    name: "skills",
    label: "Compétences associées",
    type: "text",
    useButtonAddNew: true,
    creationButtonText: "Ajouter une compétence",
    useCommands: true,
    placeholder: "Recherchez une compétence...",
  },
] satisfies Parameters<typeof TaskTemplateCreation>[0]["inputControllers"];

export const taskItemInputControllers = [
  {
    name: "name",
    title: "Nom de la tâche",
    type: "text",
    placeholder: "Ex: Installer un système d'exploitation...",
  },
  {
    name: "description",
    title: "Description",
    type: "text",
    placeholder: "Ex: La tâche consiste à ...",
  },
] satisfies Parameters<typeof TaskItem>[0]["inputControllers"];
