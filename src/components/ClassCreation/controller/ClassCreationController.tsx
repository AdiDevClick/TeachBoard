import type { HandleAddNewItemParams } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/PopoverField.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import { VerticalFieldSelectWithController } from "@/components/Selects/VerticalFieldSelect.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { classCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { ClassCreationInputItem } from "@/models/class-creation.models.ts";
import type { DiplomaCreationFormSchema } from "@/models/diploma-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, useCallback, useEffect, useRef, useState } from "react";

const year = new Date().getFullYear();
const years = yearsListRange(year, 5);
const defaultSchoolYear = year + " - " + (year + 1);

const defaultState = {
  selected: false,
  role: "",
  isEditing: false,
  prevText: "",
  newText: "",
  // isEdited: false,  // removed - we handle edit state via isEditing and newText
};

export function ClassCreationController({
  modalMode = true,
  inputControllers = classCreationInputControllers,
  pageId,
  className,
  form,
  formId,
  ...props
}: Readonly<PageWithControllers<ClassCreationInputItem>>) {
  const [state, setState] = useState(defaultState);
  const [isYearOpened, setIsYearOpened] = useState(false);
  const [isSelectedDiploma, setIsSelectedDiploma] = useState(false);
  // const currentStudents = Array.from(form.watch("studentsValues") || []);
  const currentTasks = new Set(form.watch("tasksValues") || []);

  const studentsRef = useRef(null!);
  const {
    error,
    isLoading,
    isLoaded,
    setRef,
    observedRefs,
    submitCallback,
    fetchParams,
    data,
    newItemCallback,
    openingCallback,
    dialogOptions,
    openedDialogs,
  } = useCommandHandler({
    form,
    pageId,
  });

  /**
   * Sync studentsRef with form's studentsValues
   *
   * @description Updates the studentsRef whenever the form's studentsValues change.
   *
   * @remark This is necessary to keep the ref in sync with the form state, as refs do not trigger re-renders.
   */
  useEffect(() => {
    studentsRef.current = Object.values(form.watch("studentsValues") || []);
  }, [form]);

  const cachedKeysRef = useRef<unknown[]>([]);
  const selectedDiplomaRef = useRef<CommandItemType | null>(null);

  const queryClient = useQueryClient();

  const resultsCallback = useCallback((keys: any) => {
    saveKeys(keys, cachedKeysRef);
    const cachedData = queryClient.getQueryData(keys ?? []);

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Cached data for ", keys, " is ", cachedData);
    }

    if (cachedData === undefined) {
      return data;
    }

    return cachedData;
  }, []);

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, fetch data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    const linkedDiploma = selectedDiplomaRef.current;
    const isNewTaskTemplate =
      metaData?.task === "new-task-template" && linkedDiploma;

    if (isNewTaskTemplate) {
      metaData.apiEndpoint =
        API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
          linkedDiploma.id
        );
      metaData["degreeConfig"] = linkedDiploma;
    }

    openingCallback(open, metaData, inputControllers);
  };

  const handleSubmit = (variables: DiplomaCreationFormSchema) => {
    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint,
      API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape
    );
  };

  useEffect(() => {
    if (!pageId || observedRefs.size === 0) return;
    const observed = observedRefs.get(pageId + "-schoolYear");
    console.log("Observed for schoolYear:", observed);
    if (observed) {
      const el = observed.element as HTMLElement | null;
      const meta = observed.meta as { name?: string } | undefined;
      if (el) {
        console.log(meta?.name === "degreeConfigId");
        form.setFocus("schoolYear");
      }
    }
  }, [observedRefs, form, pageId]);

  const handleCommandSelection = (
    value: string,
    commandItemDetails: CommandItemType
  ) => {
    const taskTemplateId = commandItemDetails.id;
    const tasks = new Set(form.watch("tasks") || []);

    if (currentTasks.has(value)) {
      tasks.delete(taskTemplateId);
      currentTasks.delete(value);
    } else {
      currentTasks.add(value);
      tasks.add(taskTemplateId);
    }
    form.setValue("tasksValues", Array.from(currentTasks), {
      shouldValidate: true,
    });

    form.setValue("tasks", Array.from(tasks), { shouldValidate: true });
  };

  const handleOnSelect = (value: string, commandItem: CommandItemType) => {
    selectedDiplomaRef.current = commandItem;
    setIsSelectedDiploma(!!commandItem);
  };

  const handleNewItem = ({ e, ...rest }: HandleAddNewItemParams) => {
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Add new item triggered", {
        apiEndpoint: rest.apiEndpoint,
        task: rest.task,
      });
    }
    const task = rest.task;

    console.log("opening new students item");

    if (task === "search-students") {
      rest.apiEndpoint = API_ENDPOINTS.GET.STUDENTS.endpoint;
      rest.dataReshapeFn = API_ENDPOINTS.GET.STUDENTS.dataReshape;
      rest.form = form;
      rest.selectedStudents = studentsRef.current;
    }

    if (task === "new-task-template" && selectedDiplomaRef.current) {
      rest.apiEndpoint =
        API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
          selectedDiplomaRef.current.id
        );
      rest.selectedDiploma = selectedDiplomaRef.current;
      rest.shortTemplatesList = data.data.shortTemplatesList;
    }

    newItemCallback({
      e,
      ...rest,
    });
  };

  // handleRoleClick removed (popovers handle toggle via onOpenChange)

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
  //   const selection = globalThis.getSelection();
  //   newRange.selectNodeContents(editable);

  //   selection?.focusNode;
  //   selection?.removeAllRanges();
  //   selection?.addRange(newRange);

  //   console.log("Edit role:", roleId);

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

  // const handleOnCancel = (e: PointerEvent<HTMLButtonElement>) => {
  //   preventDefaultAndStopPropagation(e);
  //   console.log("Cancel role edit:", state.role);
  //   // // remove contenteditable state
  //   // const roleId = (e.currentTarget.id ?? "").split("-")[0];
  //   // const editable = document.getElementById(roleId);
  //   // if (editable) {
  //   //   // editable.removeAttribute("contenteditable");
  //   //   // editable.removeAttribute("data-is-editing");
  //   //   editable.removeAttribute("style");
  //   // }
  //   setState((prev) => ({
  //     ...prev,
  //     isEditing: false,
  //     newText: "",
  //     prevText: "",
  //   }));
  // };

  // const handleOnTextEdited = (e: PointerEvent<HTMLButtonElement>) => {
  //   preventDefaultAndStopPropagation(e);
  //   const buttonEl = e.currentTarget;
  //   const newText = buttonEl.textContent ?? "";

  //   console.log(
  //     "Text edited for role:",
  //     buttonEl.id,
  //     "New text:",
  //     newText,
  //     state
  //   );

  //   setState((prev) => ({
  //     ...prev,
  //     newText,
  //     isEdited: true,
  //     isEditing: false,
  //   }));

  //   // cleanup contenteditable & attributes
  //   buttonEl.removeAttribute("style");
  //   // buttonEl.removeAttribute("contenteditable");
  //   // buttonEl.removeAttribute("data-is-editing");
  // };

  // const roles = [
  //   "serveur",
  //   "cuisine",
  //   "barman",
  //   "caissier",
  //   "invite",
  //   "testeur",
  // ];

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

  // const handleFocus = (e: PointerEvent<HTMLButtonElement>) => {
  //   // preventDefaultAndStopPropagation(e);
  //   const editable = e.currentTarget;
  //   const roleId = editable.id;
  //   editable.focus();
  //   editable.dispatchEvent(new KeyboardEvent("keyup", { key: "arrowRight" }));
  //   editable.addEventListener(
  //     "keyup",
  //     (event) => {
  //       console.log(event);
  //       preventDefaultAndStopPropagation(event);
  //       if (event.key === "arrowRight" || event.key === "arrowLeft") {
  //         event.target.focus();
  //         const selection = window.getSelection();
  //         if (!selection) return;
  //         const range = document.createRange();
  //         range.selectNodeContents(editable);
  //         selection.removeAllRanges();
  //         selection.addRange(range);
  //       }
  //     },
  //     { once: true }
  //   );
  //   // editable.style.setProperty("user-select", "text");
  //   // editable.style.setProperty("-webkit-user-modify", "read-write");
  //   // const editable = document.getElementById(roleId);
  //   // if (!editable) return;
  //   // editable.style.setProperty("user-select", "none");
  //   // editable.style.setProperty("-webkit-user-modify", "read-only");
  // };
  // Get the current skills from the form

  // console.log("Current Students => ", currentStudents);
  console.log("Current Students in REF => ", studentsRef.current);

  return (
    <form
      ref={(el) => setRef(el, { name: pageId, formId })}
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="grid gap-4"
    >
      <ControlledInputList
        items={inputControllers.slice(0, 2)}
        form={form}
        setRef={setRef}
      />
      <PopoverFieldWithControllerAndCommandsList
        items={inputControllers.slice(3, 5)}
        form={form}
        // id={`${pageId}-year`}
        setRef={setRef}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
        observedRefs={observedRefs}
        onOpenChange={handleOpening}
        onSelect={handleOnSelect}
        onAddNewItem={handleNewItem}
      />
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {Object.entries(studentsRef.current ?? []).map(
          ([fullName, studentDetails]) => {
            // const fullName = `${studentDetails.firstName} ${studentDetails.lastName}`;
            return (
              <Avatar key={studentDetails.id}>
                <AvatarImage
                  src={`https://github.com/${studentDetails.firstName}.png`}
                  alt={`@${fullName}`}
                />
                <AvatarFallback>
                  {studentDetails.firstName.slice(0, 1).toUpperCase()}
                  {studentDetails.lastName.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            );
          }
        )}
      </div>
      <Activity mode={isSelectedDiploma ? "visible" : "hidden"}>
        <ControlledDynamicTagList
          form={form}
          setRef={setRef}
          {...inputControllers[2]}
          observedRefs={observedRefs}
          itemList={Array.from(currentTasks)}
        />
        <PopoverFieldWithCommands
          multiSelection
          setRef={setRef}
          onSelect={handleCommandSelection}
          onOpenChange={handleOpening}
          observedRefs={observedRefs}
          onAddNewItem={handleNewItem}
          commandHeadings={resultsCallback([
            fetchParams.contentId,
            fetchParams.url,
          ])}
          {...inputControllers[2]}
        />
      </Activity>
      <VerticalFieldSelectWithController
        setRef={setRef}
        observedRefs={observedRefs}
        name="schoolYear"
        form={form}
        fullWidth={false}
        placeholder={"defaultSchoolYear"}
        defaultValue={defaultSchoolYear}
        label="Année scolaire"
        id={`${pageId}-schoolYear`}
      >
        <ListMapper items={years}>
          <NonLabelledGroupItem />
        </ListMapper>
      </VerticalFieldSelectWithController>

      {/* <PopoverFieldWithControlledCommands
        setRef={setRef}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
        observedRefs={observedRefs}
        onLoad={(e) => {
          console.log(e);
          setIsYearOpened(true);
        }}
        onOpenChange={handleOpening}
        onAddNewItem={newItemCallback}
        form={form}
        {...inputControllers[4]}
      >
        {isYearOpened && (
          <ListMapper items={years}>
            <NonLabelledGroupItem />
          </ListMapper>
        )}
      </PopoverFieldWithControlledCommands> */}
      {/* <ItemGroup id={`${pageId}-roles`} className="grid gap-2">
        <ItemTitle>Ajouter des rôles</ItemTitle>
        <Item variant={"default"} className="p-0">
          <ItemContent className="flex-row flex-wrap gap-2">
            <ListMapper items={roles}>
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
        <ItemActions className="p-0">
          <Button variant="ghost" size="icon" className="rounded-full max-h-5">
            <PlusIcon />
          </Button>
        </ItemActions>
      </ItemGroup> */}
      {/* {data?.data?.classes.length > 0 && (
            <>
              <SelectSeparator />
              <ListMapper items={data.data.classes}>
                <LabelledGroup ischild>
                  <NonLabelledGroupItem />
                </LabelledGroup>
              </ListMapper>
            </>
          )}
          {/* </VerticalFieldSelect> */}

      {/* School Year Select */}
    </form>
  );
}

/**
 * Save the provided keys into the given ref object.
 *
 * @description You can then call any query with these keys to get cached data.
 *
 * @param keys - The keys to be saved.
 * @param ref - The ref object where the keys will be stored.
 */
function saveKeys(keys: unknown[], ref: object) {
  ref.current = { ...ref.current, [keys[0]]: keys };
}

/**
 * Generates a list of school years within a specified range.
 *
 * @param year - The central year to base the range on.
 * @param range - The number of years to include before and after the central year.
 * @returns An array of objects containing the school year names and IDs.
 */
function yearsListRange(
  year: number,
  range: number
): { name: string; id: string }[] {
  const startYear = year - range;
  const endYear = year + range;
  const length = endYear - startYear + 1;
  return Array.from({ length }, (_v, i) => {
    const yearLabel = `${startYear + i} - ${startYear + i + 1}`;
    return {
      name: yearLabel,
      id: yearLabel,
    };
  });
}
