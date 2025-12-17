import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/PopoverField.tsx";
import type { PopoverFieldProps } from "@/components/Popovers/types/popover.types.ts";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { DiplomaCreationFormSchema } from "@/models/diploma-creation.models.ts";
import type { SignupInputItem } from "@/pages/Signup/types/signup.types.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, type PointerEvent } from "react";

const inputs = [
  {
    task: "new-degree-item-field",
    name: "diplomaField",
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
    name: "schoolYear",
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
    name: "schoolLevel",
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

export type HandleAddNewItemParams = {
  e?: PointerEvent<HTMLElement>;
  apiEndpoint?: (typeof inputs)[number]["apiEndpoint"];
  task: (typeof inputs)[number]["task"];
  dataReshapeFn?: (typeof inputs)[number]["dataReshapeFn"];
};

export function DiplomaCreationController({
  pageId,
  modalMode = true,
  className,
  inputControllers,
  form,
  formId,
  ...props
}: Readonly<PageWithControllers<SignupInputItem>>) {
  const {
    setRef,
    observedRefs,
    submitCallback,
    fetchParams,
    data,
    newItemCallback,
    openingCallback,
  } = useCommandHandler({
    form,
    pageId,
  });
  const queryClient = useQueryClient();

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

  // const handleOnDelete = (e: PointerEvent<HTMLButtonElement>) => {
  //   preventDefaultAndStopPropagation(e);
  //   console.log("Delete role:", state.role);
  //   setState(defaultState);
  // };

  // const handleOnEdit = (e: PointerEvent<HTMLButtonElement>) => {
  //   preventDefaultAndStopPropagation(e);
  //   const roleId = e.currentTarget.id.split("-")[0];
  //   const editable = document.getElementById(roleId);
  //   if (!editable) return;
  //   editable.focus();
  //   editable.dataset.isEditing = "true";
  //   editable.style.setProperty("user-select", "text");
  //   editable.style.setProperty("-webkit-user-modify", "read-write");
  //   const newRange = new Range();

  //   const selection = window.getSelection();
  //   newRange.selectNodeContents(editable);

  //   selection?.focusNode;
  //   selection?.removeAllRanges();
  //   selection?.addRange(newRange);

  //   setState((prev) => ({
  //     ...prev,
  //     isEditing: true,
  //     prevText: roleId,
  //     selected: true,
  //     role: roleId,
  //   }));
  // };

  // const handleOnValidate = (e: PointerEvent<HTMLButtonElement>) => {
  //   preventDefaultAndStopPropagation(e);
  //   const role = e.currentTarget.id.split("-")[0];
  //   console.log("Validate role edit:", state.role);
  //   if (role === state.role) {
  //     // cleanup editable state on validate
  //     const editable = document.getElementById(role);
  //     if (editable) {
  //       // editable.removeAttribute("contenteditable");
  //       // editable.removeAttribute("data-is-editing");
  //       editable.removeAttribute("style");
  //       const selection = window.getSelection();
  //       selection?.removeAllRanges();
  //     }
  //     setState(defaultState);
  //   }
  // };

  // const onRoleOpenChange = (open: boolean, role: string) => {
  //   if (state.isEditing) return;
  //   console.log("openChange");
  //   setState(
  //     open
  //       ? {
  //           selected: true,
  //           role,
  //           isEditing: false,
  //           prevText: "",
  //           newText: "",
  //         }
  //       : defaultState
  //   );
  // };

  // const handleOnCancel = (e: PointerEvent<HTMLButtonElement>) => {
  //   preventDefaultAndStopPropagation(e);
  //   setState((prev) => ({
  //     ...prev,
  //     isEditing: false,
  //     newText: "",
  //     prevText: "",
  //   }));
  // };

  // const handleAddNewItem = ({
  //   e,
  //   apiEndpoint,
  //   task,
  // }: HandleAddNewItemParams) => {
  //   if (DEV_MODE && !NO_CACHE_LOGS) {
  //     console.log("Add new item triggered", {
  //       apiEndpoint,
  //       task,
  //     });
  //   }
  //   // console.log(openedDialogs);
  //   openDialog(e, task, {
  //     task,
  //     apiEndpoint,
  //     queryKey: [fetchParams.contentId, fetchParams.url],
  //   });
  // };

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

  const handleSubmit = (variables: DiplomaCreationFormSchema) => {
    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint,
      API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape
    );
  };

  const handleCommandSelection = (value: string) => {
    if (currentSkills.has(value)) {
      currentSkills.delete(value);
    } else {
      currentSkills.add(value);
    }
    form.setValue("mainSkillsList", Array.from(currentSkills), {
      shouldValidate: true,
    });
  };

  /**
   * Set ids based on selected command value
   *
   * @param value
   */
  const onSelectHandler = (value: string) => {
    const cachedData = queryClient.getQueryData([
      fetchParams.contentId,
      fetchParams.url,
    ]);
    const array = cachedData?.[0];
    const data = array?.items;
    const matchingItems = data?.filter((item: any) => item.value === value);
    const firstItem = matchingItems ? matchingItems[0] : null;
    const id = firstItem?.id ?? value;

    form.setValue(switchFields(firstItem.type), id, {
      shouldValidate: true,
    });
  };

  // Get the current skills from the form
  const currentSkills = new Set(form.watch("mainSkillsList") || []);

  return (
    <form
      id={formId}
      className="grid gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <PopoverFieldWithControllerAndCommandsList
        items={inputs.slice(0, 3)}
        form={form}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
        onSelect={onSelectHandler}
        // role="combobox"
        // Command search box value changed
        // onValueChange={(value) =>
        //   console.log(
        //     "value changed ->",
        //     VerticalFieldSelectRef.current?.getLastSelectedItemValue(),
        //     VerticalFieldSelectRef.current?.getLastCommandValue(),
        //     value
        //   )
        // }
        // Selection on command item triggered
        // onSelect={(select) => {}}
        // Vertical field just triggered opening
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
        itemList={Array.from(currentSkills)}
      />
      <PopoverFieldWithCommands
        multiSelection
        setRef={setRef}
        onSelect={handleCommandSelection}
        onOpenChange={handleOpening}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
        {...inputs[3]}
      />
      {/* <ItemGroup id={`${pageId}-roles`} className="grid gap-2">
        <ItemTitle>Modules</ItemTitle>
        <Item variant={"default"} className="p-0">
          <ItemContent className="flex-row flex-wrap gap-2">
            <ListMapper items={skills}>
              {(rawItem: string | { item: string; id?: string }) => {
                const item =
                  typeof rawItem === "string" ? rawItem : rawItem.item;
                return (
                  <ItemActions key={item} className="relative">
                    <Popover
                      open={state.selected && state.role === item}
                      onOpenChange={(open) => onRoleOpenChange(open, item)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          // onBlur={handleOnTextEdited}
                          // onFocus={handleOnTextEdit}
                          // onClick={handleFocus}
                          data-is-editing={
                            state.isEditing && state.role === item
                          }
                          id={item}
                          size="sm"
                          variant="outline"
                          contentEditable={
                            state.isEditing && state.role === item
                          }
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
                        {state.isEditing && state.role === item ? (
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
                        )}
                        <PopoverArrow className="fill-popover" />
                      </PopoverContent>
                    </Popover>
                  </ItemActions>
                );
              }}
            </ListMapper>
          </ItemContent>
        </Item>
      </ItemGroup> */}
    </form>
  );
}

/**
 * Verify the input type and return the corresponding field name
 *
 * @param fieldName
 */
function switchFields(fieldName: string) {
  let field = "";
  switch (fieldName) {
    case "FIELD":
      field = "diplomaFieldId";
      break;
    case "YEAR":
      field = "yearId";
      break;
    case "LEVEL":
      field = "levelId";
      break;
    default:
      break;
  }
  return field;
}
