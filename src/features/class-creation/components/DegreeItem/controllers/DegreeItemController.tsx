import { FormWithDebug } from "@/components/Form/FormWithDebug";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input.exports";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { DegreeTypeMessage } from "@/features/class-creation/components/DegreeItem/controllers/types/degree-item-controller.types";
import { degreeCreationInputControllersField } from "@/features/class-creation/components/DegreeItem/forms/degree-item-inputs";
import type { DegreeItemControllerProps } from "@/features/class-creation/components/DegreeItem/types/degree-item.types.ts";
import { useDebouncedChecker } from "@/features/class-creation/components/main/hooks/useDebouncedChecker";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import { type ChangeEvent } from "react";
import { toast } from "sonner";

const loaderToasterId = "degree-item-creation-loader-toast";
const creationToasterId = "degree-item-created-toast";

/**
 * Controller component for creating a new degree item.
 *
 * !! IMPORTANT !! Be sure that the inputControllers passed to this component are already validated by Zod Schema.
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param form - The react-hook-form instance.
 * @param className - Additional CSS classes for styling.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param submitDataReshapeFn - Function to reshape data before submission.
 *
 * @remarks The POST and GET ENDPOINTS share the same apiEndpoint and will be used from the input controllers directly
 * This prevent the use of a useless and cognitive type check here.
 */
export function DegreeItemController({
  pageId,
  inputControllers = degreeCreationInputControllersField,
  className,
  formId,
  form,
  submitDataReshapeFn = API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape,
}: DegreeItemControllerProps) {
  const {
    setRef,
    observedRefs,
    submitCallback,
    serverData,
    isLoading,
    invalidSubmitCallback,
  } = useCommandHandler({
    form,
    pageId,
    submitDataReshapeFn,
  });

  const { availabilityCheck } = useDebouncedChecker(form, 300);

  if (isLoading) {
    toast.loading("Création en cours...", { id: loaderToasterId });
  }

  if (serverData?.degree) {
    toast.dismiss(loaderToasterId);
    const type = serverData.degree.type ?? "UNKNOWN";

    const { typeMessage, defaultGenre } = getTypeMessage(type);

    toast.success(`${typeMessage} ${defaultGenre} avec succès !`, {
      id: creationToasterId,
    });
  }

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    submitCallback(variables, {
      dataReshapeFn: submitDataReshapeFn,
    });
  };

  /**
   * Send a debouned API request to check for class name availability when the class name input changes.
   *
   * @param event - The change event from the class name input
   * @param meta - Optional metadata for the command handler, including API endpoint information
   */

  const handleCodeOrNameChange = (
    event: ChangeEvent<HTMLInputElement>,
    meta?: CommandHandlerFieldMeta,
  ) => {
    const fieldName = meta?.name;
    if (!fieldName) {
      return;
    }
    const type = pageId.split("-").at(-1)?.toUpperCase();

    availabilityCheck(event, {
      ...meta,
      searchParams: { filterBy: fieldName, type },
    });
  };

  return (
    <FormWithDebug
      form={form}
      setRef={setRef}
      pageId={pageId}
      formId={formId}
      className={className}
      onValidSubmit={handleSubmit}
      onInvalidSubmit={invalidSubmitCallback}
    >
      <ControlledInputList
        items={inputControllers}
        control={form.control}
        setRef={setRef}
        observedRefs={observedRefs}
        onChange={handleCodeOrNameChange}
      />
    </FormWithDebug>
  );
}

/**
 * Get the message type based on degree type
 *
 * @param type - degree type
 */
function getTypeMessage(type: string): DegreeTypeMessage {
  const defined = { typeMessage: "", defaultGenre: "créé" };

  switch (type) {
    case "FIELD":
      defined.typeMessage = "Nom du métier / domaine";
      break;
    case "DEGREE":
      defined.typeMessage = "Diplôme";
      break;
    case "YEAR":
      defined.typeMessage = "Année d'étude";
      defined.defaultGenre = "créée";
      break;
    default:
      defined.typeMessage = "Élément";
  }

  return defined;
}
