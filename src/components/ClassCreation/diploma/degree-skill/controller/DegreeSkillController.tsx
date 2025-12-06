import type { HandleAddNewItemParams } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import type { DegreeSkillProps } from "@/components/ClassCreation/diploma/degree-skill/types/degree-skill.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { PopoverFieldWithControlledCommands } from "@/components/Popovers/PopoverField.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  DEV_MODE,
  NO_CACHE_LOGS,
  type AppModalNames,
} from "@/configs/app.config.ts";
import { degreeMainSkillsCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useDegreeCreation } from "@/hooks/useDegreeCreation.ts";
import { PopoverArrow } from "@radix-ui/react-popover";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { data } from "react-router-dom";

/**
 * Controller component for creating a new degree skill.
 *
 * !! IMPORTANT !! Be sure that the inputControllers passed to this component are already validated by Zod Schema.
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param form - The react-hook-form instance.
 * @param className - Additional CSS classes for styling.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 */
export function DegreeSkillController({
  pageId = "new-degree-skill",
  inputControllers = degreeMainSkillsCreationInputControllers,
  className = "grid gap-4",
  formId,
  form,
  queryHooks,
  fetchHooks,
}: Readonly<DegreeSkillProps>) {
  const { openDialog } = useDialog();
  const queryClient = useQueryClient();
  const { fetchParams, onSubmit, setFetchParams } = fetchHooks;
  const { handleSubmit, setRef, observedRefs } = useDegreeCreation({
    queryHooks,
    form,
    hookOptions: {
      pageId: pageId as AppModalNames,
      inputControllers: inputControllers,
    },
  });

  const resultsCallback = useCallback((keys: any) => {
    const cachedData = queryClient.getQueryData(keys ?? []);
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Cached data for ", keys, " is ", cachedData);
    }
    if (cachedData === undefined) {
      return data;
    }
    return cachedData;
  }, []);

  const handleAddNewItem = ({
    e,
    apiEndpoint,
    task,
  }: HandleAddNewItemParams) => {
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Add new item triggered", {
        apiEndpoint,
        task,
      });
    }
    // console.log(openedDialogs);
    openDialog(e, "new-degree-item", {
      task: "get-degrees",
      apiEndpoint,
      queryKey: [fetchParams.contentId, fetchParams.url],
    });
  };

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, fetch data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    if (!open) return;

    const task = metaData?.task;
    const apiEndpoint = metaData?.apiEndpoint;

    // Ensure apiEndpoint is present and correspond to a known input
    const found = inputControllers.find(
      (input) => input.task === task && input.apiEndpoint === apiEndpoint
    );
    if (!found) return;

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.debug("handleOpening diploma creation & Fetching ", metaData);
    }

    setFetchParams((prev) => ({
      ...prev,
      dataReshape: API_ENDPOINTS.GET.SKILLS.dataReshape,
      url: API_ENDPOINTS.GET.SKILLS.endPoint + apiEndpoint,
      contentId: "fetch-skills",
    }));
  };

  /**
   * Effect to fetch data when fetchParams change
   *
   * @description Triggers when fetchParams are updated with {@link handleOpening}
   */
  useEffect(() => {
    const keys = [fetchParams.contentId, fetchParams.url];

    if (keys[1] === "" && keys[0] === "none") return;
    const cachedData = queryClient.getQueryData(keys ?? []);

    if (cachedData === undefined) {
      onSubmit();
    }
  }, [fetchParams]);

  const skills = ["P1", "P2", "P3", "P4", "P5", "P6"];
  const id = formId ?? pageId + "-form";

  return (
    <form
      id={id}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={inputControllers}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
      />
      <ItemGroup id={`${pageId}-roles`} className="grid gap-2">
        <ItemTitle>Compétences</ItemTitle>
        <Item variant={"default"} className="p-0">
          <ItemContent className="flex-row flex-wrap gap-2">
            <ListMapper items={skills}>
              {(rawItem: string | { item: string; id?: string }) => {
                const item =
                  typeof rawItem === "string" ? rawItem : rawItem.item;
                return (
                  <ItemActions key={item} className="relative">
                    <Popover
                    // open={state.selected && state.role === item}
                    // onOpenChange={(open) => onRoleOpenChange(open, item)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          // onBlur={handleOnTextEdited}
                          // onFocus={handleOnTextEdit}
                          // onClick={handleFocus}
                          // data-is-editing={
                          //   state.isEditing && state.role === item
                          // }
                          id={item}
                          size="sm"
                          variant="outline"
                          // contentEditable={
                          //   state.isEditing && state.role === item
                          // }
                        >
                          {item}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        align="center"
                        sideOffset={8}
                        className="p-0.5 w-auto max-h-min-content"
                      >
                        {/* {state.isEditing && state.role === item ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              id={item + "-validate"}
                              onClick={handleOnValidate}
                              aria-label={`Valider ${item}`}
                            >
                              <CheckIcon className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              id={item + "-cancel"}
                              onClick={handleOnCancel}
                              aria-label={`Annuler ${item}`}
                            >
                              <RotateCcw className="size-4" />
                            </Button>
                          </>
                        ) : (
                          state.role === item && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleOnEdit}
                                id={item + "-edit"}
                                aria-label={`Modifier ${item}`}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleOnDelete}
                                id={item + "-delete"}
                                aria-label={`Supprimer ${item}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                              <PopoverClose asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  id={item + "-close"}
                                  aria-label={`Fermer ${item}`}
                                >
                                  <XIcon className="size-4" />
                                </Button>
                              </PopoverClose>
                            </>
                          )
                        )} */}
                        <PopoverArrow className="fill-popover" />
                      </PopoverContent>
                    </Popover>
                  </ItemActions>
                );
              }}
            </ListMapper>
          </ItemContent>
        </Item>
        {/* <ItemActions className="p-0">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full max-h-5"
            onClick={(e) => openDialog(e, "new-degree-skill")}
          >
            <PlusIcon />
          </Button>
        </ItemActions> */}
      </ItemGroup>
      <PopoverFieldWithControlledCommands
        form={form}
        label={inputControllers[2].title}
        setRef={setRef}
        // role="combobox"
        onOpenChange={handleOpening}
        observedRefs={observedRefs}
        onAddNewItem={handleAddNewItem}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
        {...inputControllers[2]}
      />
    </form>
  );
}
