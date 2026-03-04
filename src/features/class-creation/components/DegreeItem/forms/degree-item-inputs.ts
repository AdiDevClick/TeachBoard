import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type DegreeItem from "@/features/class-creation/components/DegreeItem/DegreeItem.tsx";

export const degreeCreationInputControllersDegree = [
  {
    name: "name",
    title: "Nom",
    type: "text",
    placeholder: "Ex: Brevet des collèges, Bac Pro, ...",
    autoComplete: "off",
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.AVAILABLE,
    task: "availability",
  },
  {
    name: "code",
    title: "Code",
    type: "text",
    placeholder: "Ex: BTS, BACPRO, ...",
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.AVAILABLE,
    task: "availability",
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
    title: "Nom",
    type: "text",
    placeholder: "Ex: Cuisine, Prothésiste Dentaire...",
    autoComplete: "off",
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.AVAILABLE,
    task: "availability",
  },
  {
    name: "code",
    title: "Code",
    type: "text",
    placeholder: "Ex: CUISINE, PROTHDENT...",
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.AVAILABLE,
    task: "availability",
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
    title: "Année scolaire",
    type: "text",
    placeholder: "Ex: Première année, Deuxième année...",
    autoComplete: "off",
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.AVAILABLE,
    task: "availability",
  },
  {
    name: "code",
    title: "Code",
    type: "text",
    placeholder: "Ex: 1A, 2A...",
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.AVAILABLE,
    task: "availability",
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
