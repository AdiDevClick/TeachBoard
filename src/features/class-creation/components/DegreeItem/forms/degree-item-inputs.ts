import type DegreeItem from "@/features/class-creation/components/DegreeItem/DegreeItem.tsx";

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
