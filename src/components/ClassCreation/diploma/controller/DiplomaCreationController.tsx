import type { DiplomaCreationControllerProps } from "@/components/ClassCreation/diploma/types/diploma-creation.types.ts";
import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/PopoverField.tsx";
import type { PopoverFieldProps } from "@/components/Popovers/types/popover.types.ts";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { DiplomaCreationFormSchema } from "@/models/diploma-creation.models.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";

export const inputs = [
  {
    task: "new-degree-item-field",
    name: "diplomaFieldId",
    label: "Métier / Domaine du diplôme",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un métier ou domaine",
    useButtonAddNew: true,
    useCommands: true,
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.FIELD,
    dataReshapeFn: API_ENDPOINTS.GET.DEGREES.dataReshape,
    id: "diploma-field-input",
  },
  {
    task: "new-degree-item-year",
    name: "yearId",
    label: "Année scolaire",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter une année scolaire",
    useButtonAddNew: true,
    useCommands: true,
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.YEAR,
    dataReshapeFn: API_ENDPOINTS.GET.DEGREES.dataReshape,
    id: "school-year-input",
  },
  {
    task: "new-degree-item-degree",
    name: "levelId",
    label: "Diplôme / Niveau scolaire",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un niveau scolaire",
    useButtonAddNew: true,
    useCommands: true,
    apiEndpoint: API_ENDPOINTS.GET.DEGREES.endpoints.LEVEL,
    dataReshapeFn: API_ENDPOINTS.GET.DEGREES.dataReshape,
    id: "school-level-input",
  },
  {
    id: "add-module-skills",
    apiEndpoint: API_ENDPOINTS.GET.SKILLS.endPoints.MODULES,
    dataReshapeFn: API_ENDPOINTS.GET.SKILLS.dataReshape,
    task: "new-degree-module",
    name: "mainSkillsList",
    title: "Modules",
    type: "text",
    useButtonAddNew: true,
    creationButtonText: "Ajouter un module",
    useCommands: true,
    placeholder: "Recherchez des modules...",
  },
] satisfies (PopoverFieldProps & CommandsProps)[];
// ] satisfies Parameters<typeof VerticalFieldSelectWithCommands>[];

const defaultState = {
  selected: false,
  role: "",
  isEditing: false,
  prevText: "",
  newText: "",
  selectedText: "",
};

/**
 * Diploma creation controller component
 *
 * @param pageId - The ID of the page.
 * @param form - The form instance to manage form state and actions.
 * @param formId - The ID of the form element.
 * @param props - Additional props for the DiplomaCreation component.
 *
 * @returns
 */
export function DiplomaCreationController({
  pageId,
  form,
  formId,
  ...props
}: Readonly<DiplomaCreationControllerProps>) {
  const {
    setRef,
    observedRefs,
    submitCallback,
    fetchParams,
    newItemCallback,
    openingCallback,
    selectionCallback,
    resultsCallback,
  } = useCommandHandler({
    form,
    pageId,
  });
  const queryClient = useQueryClient();
  const currentSkills =
    useWatch({
      control: form.control,
      name: "mainSkillsListDetails",
    }) || [];

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, fetch data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    openingCallback(open, metaData, inputs);
  };

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: DiplomaCreationFormSchema) => {
    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint,
      API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape
    );
  };

  const handleSelection = (
    value: string,
    taskDetails?: Record<string, unknown>
  ) => {
    const options = {
      mainFormField: "mainSkillsList",
      secondaryFormField: "mainSkillsListDetails",
      detailedCommandItem: taskDetails,
    };
    selectionCallback(value, options);
  };

  /**
   * Set ids based on selected command value
   *
   * @param value
   */
  const onSelectHandler = (value: string) => {
    type CachedItem = { value: string; id?: string; type?: string };
    type CachedPage = { items?: CachedItem[] };

    const cachedData = queryClient.getQueryData<unknown>([
      fetchParams.contentId,
      fetchParams.url,
    ]);

    const firstPage = Array.isArray(cachedData)
      ? (cachedData[0] as CachedPage | undefined)
      : undefined;

    const firstItem = firstPage?.items?.find((item) => item.value === value);
    const id = firstItem?.id ?? value;

    form.setValue(switchFields(firstItem?.type ?? ""), id, {
      shouldValidate: true,
    });
  };

  return (
    <form
      id={formId}
      className="grid gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <PopoverFieldWithControllerAndCommandsList
        items={inputs.slice(0, 3)}
        form={form}
        commandHeadings={resultsCallback()}
        onSelect={onSelectHandler}
        onOpenChange={handleOpening}
        setRef={setRef}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
      />
      <ControlledDynamicTagList
        form={form}
        setRef={setRef}
        {...inputs[3]}
        observedRefs={observedRefs}
        itemList={currentSkills}
      />
      <PopoverFieldWithCommands
        multiSelection
        setRef={setRef}
        onSelect={handleSelection}
        onOpenChange={handleOpening}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback()}
        {...inputs[3]}
      />
    </form>
  );
}

/**
 * Verify the input type and return the corresponding field name
 *
 * @param fieldName
 */
function switchFields(
  fieldName: string
): "diplomaFieldId" | "yearId" | "levelId" {
  switch (fieldName) {
    case "FIELD":
      return "diplomaFieldId";
    case "YEAR":
      return "yearId";
    case "LEVEL":
      return "levelId";
    default:
      return "diplomaFieldId";
  }
}
