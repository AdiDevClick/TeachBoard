import type { HandleAddNewItemParams } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import { resetSelectedItemsFromCache } from "@/components/ClassCreation/functions/class-creation.functions.ts";
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
import { useAppStore } from "@/hooks/store/AppStore.ts";
import type {
  ClassCreationFormSchema,
  ClassCreationInputItem,
} from "@/models/class-creation.models.ts";
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
  const user = useAppStore((state) => state.user);
  const [state, setState] = useState(defaultState);
  const [isYearOpened, setIsYearOpened] = useState(false);
  const [isSelectedDiploma, setIsSelectedDiploma] = useState(false);
  // const currentStudents = Array.from(form.watch("studentsValues") || []);
  const currentTasks = new Set(form.watch("tasksValues") || []);
  const studentsRef = useRef(null!);
  const primaryTeacherRef = useRef(null!);
  const queryClient = useQueryClient();

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
    onOpenChange,
  } = useCommandHandler({
    form,
    pageId,
  });

  const cachedKeysRef = useRef<unknown[]>([]);
  const selectedDiplomaRef = useRef<CommandItemType | null>(null);

  /**
   * Sync studentsRef with form's studentsValues
   *
   * @description Updates the studentsRef whenever the form's studentsValues change.
   *
   * @remark This is necessary to keep the ref in sync with the form state, as refs do not trigger re-renders.
   */
  useEffect(() => {
    studentsRef.current = Object.values(form.watch("studentsValues") || []);
    primaryTeacherRef.current = form.watch("primaryTeacherValue") || [];
  }, [form]);

  /**
   * Reset students selection in cache when modal closes
   *
   * @description Resets the isSelected flag for all students in the cache data
   * when the class-creation modal is closed.
   */
  const resetStudentsSelection = useCallback(() => {
    const queryKey = cachedKeysRef.current["search-students"];
    if (!queryKey) return;

    const cachedData = queryClient.getQueryData(queryKey);
    if (!cachedData || !Array.isArray(cachedData) || !cachedData[0]?.items)
      return;

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("[Reset Students] Cached data structure:", cachedData);
      console.log(
        "[Reset Students] Items type:",
        cachedData[0].items.constructor.name
      );
      console.log("[Reset Students] Students to reset:", studentsRef.current);
    }

    Object.values(studentsRef.current ?? []).forEach((studentDetails: any) => {
      const items = cachedData[0].items;

      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.log("[Reset Students] Looking for ID:", studentDetails.id);
        console.log("[Reset Students] Items is Map:", items instanceof Map);
        if (items instanceof Map) {
          console.log("[Reset Students] Map keys:", Array.from(items.keys()));
        } else if (Array.isArray(items)) {
          console.log("[Reset Students] Array length:", items.length);
        } else {
          console.log("[Reset Students] Object keys:", Object.keys(items));
        }
      }

      // Handle different data structures
      let cachedItem;

      if (Array.isArray(items)) {
        cachedItem = items.find((item: any) => item.id === studentDetails.id);
      }

      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.log("[Reset Students] Found cached item:", cachedItem);
      }

      if (cachedItem) {
        cachedItem.isSelected = false;
      }
    });
  }, []);

  /**
   * Reset students selection in cache when modal closes
   *
   * @description Resets the isSelected flag for all students in the cache data
   * when the class-creation modal is closed.
   */
  const resetPrimaryTeacherSelection = useCallback(() => {
    resetSelectedItemsFromCache(
      cachedKeysRef.current["search-primaryteacher"],
      primaryTeacherRef.current,
      queryClient
    );
  }, []);

  /**
   * Handle modal close
   *
   * @description Detects when the modal closes and resets the students selection in cache
   */
  useEffect(() => {
    const isModalOpen = openedDialogs.includes(pageId);

    if (isModalOpen) return;

    // If modal was just closed, reset students selection
    if (Object.entries(studentsRef.current ?? {}).length > 0) {
      resetStudentsSelection();
    }

    // If modal was just closed, reset primary teacher selection
    if (Object.entries(primaryTeacherRef.current ?? {}).length > 0) {
      resetPrimaryTeacherSelection();
    }
  }, [openedDialogs]);

  /**
   * Retrieve results from cache or fetched data
   * @description Checks React Query cache for existing data before falling back to fetched data.
   *
   * @param keys - The query keys to retrieve cached data for
   * @return The cached data if available, otherwise the fetched data
   */
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

  /**
   * Handle Class Creation form submission
   *
   * @description Provided API endpoint and data reshaping function
   * in order to call the submit callback correctly.
   *
   * @param variables - The form data to submit
   */
  const handleSubmit = (variables: ClassCreationFormSchema) => {
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

  /**
   * Handle command selection from PopoverFieldWithCommands
   * @description Updates the form values based on selected command items.
   *
   * @param value - The value of the selected command item
   * @param commandItemDetails - The details of the selected command item
   */
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

  /**
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   * @description Updates the selected diploma reference and selection state.
   *
   * @param value - The value of the selected command item
   * @param commandItem - The details of the selected command item
   */
  const handleOnSelect = (value: string, commandItem: CommandItemType) => {
    selectedDiplomaRef.current = commandItem;
    setIsSelectedDiploma(!!commandItem);
  };

  /**
   * Handle adding a new item
   *
   * @param e - The event triggering the new item addition
   * @param rest - Additional parameters related to the new item
   */
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
      saveKeys([task, rest.apiEndpoint], cachedKeysRef);
    }

    if (task === "search-primaryteacher") {
      rest.apiEndpoint = API_ENDPOINTS.GET.TEACHERS.endpoint;
      rest.dataReshapeFn = API_ENDPOINTS.GET.TEACHERS.dataReshape;
      rest.form = form;
      rest.selectedPrimaryTeacher = primaryTeacherRef.current;
      saveKeys([task, rest.apiEndpoint], cachedKeysRef);
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
          ([fullName, studentDetails]) => (
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
          )
        )}
      </div>
      <PopoverFieldWithControllerAndCommandsList
        items={inputControllers.slice(5, 6)}
        form={form}
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
        {Object.entries(primaryTeacherRef.current ?? []).map(
          ([fullName, teacherDetails]) => (
            <Avatar key={teacherDetails.id}>
              <AvatarImage
                src={`https://github.com/${teacherDetails.firstName}.png`}
                alt={`@${fullName}`}
              />
              <AvatarFallback>
                {teacherDetails.firstName.slice(0, 1).toUpperCase()}
                {teacherDetails.lastName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )
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
