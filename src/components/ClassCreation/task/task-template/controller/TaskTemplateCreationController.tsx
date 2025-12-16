import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { PopoverFieldWithControllerAndCommandsList } from "@/components/Popovers/PopoverField.tsx";
import { DynamicTag } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

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

  const savedSkills = useRef(null!);

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
      if (!savedSkills.current) {
        const displayedSkills = diplomaDatas.skills.map((skill: string) => {
          const mainSkillCode = skill.mainSkillCode || "Unknown Skill";
          const mainSkillId = skill.mainSkillId || "unknown-id";

          return {
            groupTitle: mainSkillCode,
            id: mainSkillId,
            items: skill.subSkills.map((subSkill: string) => ({
              value: subSkill.code,
              label: subSkill.name,
              id: subSkill.id,
            })),
          };
        });

        savedSkills.current = displayedSkills;

        return displayedSkills;
      }

      return savedSkills.current;
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
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape
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

  const handleCommandSelection = (value: string, commandItemDetails) => {
    const isTask = Object.hasOwn(commandItemDetails, "description");
    if (isTask) {
      form.setValue("taskId", commandItemDetails.id, { shouldValidate: true });
      return;
    }

    const current = new Map(form.getValues("skillsDuplicate"));

    const main = commandItemDetails.groupId;
    const sub = commandItemDetails.id;
    let subSkillsSet = new Set();

    if (!current.has(main)) {
      subSkillsSet.add(sub);
    } else {
      subSkillsSet = new Set(current.get(main).subSkillId);

      if (subSkillsSet.has(sub)) {
        subSkillsSet.delete(sub);
      } else {
        subSkillsSet.add(sub);
      }

      if (subSkillsSet.size === 0) {
        current.delete(main);
      }
    }

    if (subSkillsSet.size > 0) {
      current.set(main, {
        mainSkill: main,
        subSkillId: Array.from(subSkillsSet.values()),
      });
    }

    form.setValue("skillsDuplicate", Array.from(current), {
      shouldValidate: true,
    });

    form.setValue("skills", Array.from(current.values()), {
      shouldValidate: true,
    });
  };

  const id = formId ?? pageId + "-form";

  if (form.getValues("degreeConfigId") !== diplomaDatas.id) {
    form.setValue("degreeConfigId", diplomaDatas.id, {
      shouldValidate: true,
    });
  }

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
      <DynamicTag
        {...inputControllers[2]}
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
