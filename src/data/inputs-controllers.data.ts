import type { ClassCreation } from "@/components/ClassCreation/ClassCreation.tsx";
import type { DegreeItemController } from "@/components/ClassCreation/diploma/degree-item/controller/DegreeItemController.tsx";
import type { DegreeModuleSkillController } from "@/components/ClassCreation/diploma/degree-module-skill/controller/DegreeModuleSkillController.tsx";
import type DegreeModule from "@/components/ClassCreation/diploma/degree-module/DegreeModule.tsx";
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
  // {
  //   name: "schoolYear",
  //   title: "Année scolaire",
  //   type: "button",
  //   placeholder: "Sélectionnez l'année scolaire",
  //   autoComplete: "off",
  // },
] satisfies Parameters<typeof ClassCreation>[0]["inputControllers"];

export const degreeCreationInputControllers = [
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
] satisfies Parameters<typeof DegreeItemController>[0]["inputControllers"];

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
    task: "new-degree-module-skill",
    name: "skillList",
    title: "",
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
