import withController from "@/components/HOCs/withController";
import { withDynamicFieldArray } from "@/components/HOCs/withDynamicFieldArray";
import { LabelledTextArea } from "@/components/TextAreas/LabelledTextArea";
import { CriteriaInput } from "@/features/class-creation/components/DegreeModuleSkill/components/inputs/CriteriaInput";
import { ScoreCriteria } from "@/features/class-creation/components/DegreeModuleSkill/components/scores/ScoreCriteria";

export const ControlledTextArea = withController(LabelledTextArea);
export const ControlledCriteriaInput = withController(CriteriaInput);
export const DynamicCriteriaList = withDynamicFieldArray(ScoreCriteria);
