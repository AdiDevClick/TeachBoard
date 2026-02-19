import { FormWithDebug } from "@/components/Form/FormWithDebug";
import { ControlledDynamicTagList } from "@/components/Tags/exports/dynamic-tags.exports";
import { ControlledLabelledTextArea } from "@/components/TextAreas/exports/labelled-textarea";
import { HTTP_METHODS } from "@/configs/app.config";
import { LabelledAccordion } from "@/features/evaluations/create/components/Accordion/LabelledAccordion";
import { AverageFields } from "@/features/evaluations/create/components/Score/AverageFields";
import type { StepFourControllerProps } from "@/features/evaluations/create/steps/four/controller/types/step-four-controller.types";
import { useStepFourHandler } from "@/features/evaluations/create/steps/four/hooks/useStepFourHandler";
import {
  stepFourInputSchema,
  type StepFourFormSchema,
} from "@/features/evaluations/create/steps/four/models/step-four.models";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";

/**
 * Step Four Controller.
 *
 * @param pageId - The ID of the page, used for debugging and logging purposes.
 * @param form - The react-hook-form instance used for managing the form state and validation.
 * @param formId - The ID of the form, used for debugging and logging purposes.
 * @param className - Additional class name(s) to be applied to the form container for styling.
 * @param inputControllers - An object containing the configuration for the various input controllers used in this step, such as the accordion and average fields.
 */
export function StepFourController({
  pageId,
  form,
  formId,
  className,
  inputControllers,
  submitRoute,
  submitDataReshapeFn,
}: StepFourControllerProps) {
  const {
    scoreValue,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
    presenceMemo,
    handleValidSubmit,
    invalidSubmitCallback,
  } = useStepFourHandler({ form, pageId, submitRoute, submitDataReshapeFn });

  return (
    <>
      <LabelledAccordion
        inputController={inputControllers.modules}
        accordionItems={modules}
        storeGetter={getEvaluatedStudentsForSubSkill}
        valueGetter={scoreValue}
      />
      <FormWithDebug
        form={form}
        formId={formId}
        className={className}
        onInvalidSubmit={invalidSubmitCallback}
        onValidSubmit={handleValidSubmit}
      >
        <AverageFields
          form={form}
          students={allStudentsAverageScores}
          {...inputControllers.scoresAverage}
        />
        <ControlledDynamicTagList
          {...inputControllers.absence}
          form={form}
          pageId={pageId}
          itemList={presenceMemo.students}
          displayCRUD={false}
        />
        <ControlledLabelledTextArea
          {...inputControllers.comments}
          form={form}
        />
      </FormWithDebug>
    </>
  );
}
