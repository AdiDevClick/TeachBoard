import { switchFields } from "@/components/ClassCreation/diploma/functions/diploma.functions.ts";
import type { DiplomaCreationControllerProps } from "@/components/ClassCreation/diploma/types/diploma-creation.types.ts";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/PopoverField.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { DiplomaCreationFormSchema } from "@/models/diploma-creation.models.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";

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
  inputControllers = [],
  className,
}: DiplomaCreationControllerProps) {
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
      name: "mainSkillsListDetails" as never,
    }) || [];

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

  const controllers = {
    popoverControllers: inputControllers.slice(0, 3),
    tagListController: inputControllers[3],
  };

  return (
    <form
      id={formId}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <PopoverFieldWithControllerAndCommandsList
        items={controllers.popoverControllers}
        form={form}
        commandHeadings={resultsCallback()}
        onSelect={onSelectHandler}
        onOpenChange={openingCallback}
        setRef={setRef}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
      />
      <ControlledDynamicTagList
        form={form}
        setRef={setRef}
        {...controllers.tagListController}
        observedRefs={observedRefs}
        itemList={currentSkills}
      />
      <PopoverFieldWithCommands
        multiSelection
        setRef={setRef}
        onSelect={handleSelection}
        onOpenChange={openingCallback}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback()}
        {...controllers.tagListController}
      />
    </form>
  );
}
