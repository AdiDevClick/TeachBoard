import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { PopoverFieldWithControllerAndCommandsList } from "@/components/Popovers/PopoverField.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function TaskTemplateCreationController({
  pageId = "task-controller",
  formId,
  inputControllers,
  className = "grid gap-4",
  form,
  diplomaDatas,
}: {
  pageId?: string;
}) {
  const {
    setRef,
    observedRefs,
    fetchParams,
    data,
    newItemCallback,
    openingCallback,
    submitCallback,
  } = useCommandHandler({
    form,
    pageId,
  });

  const queryClient = useQueryClient();

  const resultsCallback = useCallback((keys: unknown[]) => {
    const cachedData = queryClient.getQueryData(keys ?? []);
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Cached data for ", keys, " is ", cachedData);
    }

    const isRetrievedSkills = keys[0] === "new-task-skill";

    if (cachedData === undefined && !isRetrievedSkills) {
      return data;
    }

    if (isRetrievedSkills && diplomaDatas) {
      return diplomaDatas.skills.map((skill: string) => ({
        groupTitle: skill.mainSkillCode,
        items: skill.subSkills.map((subSkill: string) => ({
          value: subSkill.code,
          label: subSkill.name,
        })),
      }));
    }
    return cachedData;
  }, []);

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_SKILL.endPoints.MODULE,
      API_ENDPOINTS.POST.CREATE_SKILL.dataReshape
    );
  };

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, FETCH data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    openingCallback(open, metaData, inputControllers);
  };

  const handleCommandSelection = (value: string) => {
    if (currentSkills.has(value)) {
      currentSkills.delete(value);
    } else {
      currentSkills.add(value);
    }
    form.setValue("skillList", Array.from(currentSkills), {
      shouldValidate: true,
    });
  };

  // Get the current skills from the form
  const currentSkills = new Set(form.watch("skillList") || []);

  const id = formId ?? pageId + "-form";
  console.log(diplomaDatas);

  return (
    <form
      id={id}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={inputControllers.slice(0, 2)}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
        onOpenChange={handleOpening}
      />
      <ControlledDynamicTagList
        form={form}
        setRef={setRef}
        {...inputControllers[2]}
        observedRefs={observedRefs}
        itemList={[
          `${diplomaDatas?.degreeField} - ${diplomaDatas?.degreeLevel} ${diplomaDatas?.degreeYear}`,
        ]}
      />
      <PopoverFieldWithControllerAndCommandsList
        items={inputControllers.slice(3, 5)}
        form={form}
        setRef={setRef}
        onSelect={handleCommandSelection}
        onOpenChange={handleOpening}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
      />
    </form>
  );
}
