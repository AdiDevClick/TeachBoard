import {
  CLASS_CREATION_AVATAR_INPUT_CONTROLLERS,
  CLASS_CREATION_CONTROLLED_INPUTS_CONTROLLERS,
  CLASS_CREATION_DYNAMIC_LIST_CONTROLLERS,
  CLASS_CREATION_POPOVER_CONTROLLERS,
  CLASS_CREATION_YEAR_SELECTION_CONTROLLERS,
} from "@/features/class-creation/components/main/forms/class-creation-inputs";
import type { ClassCreationInputControllers } from "@/features/class-creation/components/main/types/class-creation.types";

export const TITLE_PROPS = {
  title: "Créer une classe",
  description:
    "Ajoutez une nouvelle classe pour commencer à gérer vos élèves et leurs évaluations.",
};

export const FOOTER_PROPS = {
  submitText: "Créer la classe",
};

export const YEAR = new Date().getFullYear();
export const DEFAULT_SCHOOL_YEAR = YEAR + " - " + (YEAR + 1);
export const CLASS_CREATION_INPUT_CONTROLLERS = {
  inputs: CLASS_CREATION_CONTROLLED_INPUTS_CONTROLLERS,
  dynamicList: CLASS_CREATION_DYNAMIC_LIST_CONTROLLERS,
  popover: CLASS_CREATION_POPOVER_CONTROLLERS,
  avatar: CLASS_CREATION_AVATAR_INPUT_CONTROLLERS,
  yearSelection: CLASS_CREATION_YEAR_SELECTION_CONTROLLERS,
} satisfies ClassCreationInputControllers;
