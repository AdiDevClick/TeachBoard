import type { HandleAddNewItemParams } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import { resetSelectedItemsFromCache } from "@/components/ClassCreation/functions/class-creation.functions.ts";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { AvatarsWithLabelAndAddButtonList } from "@/components/Form/AvatarListWithLabelAndAddButton.tsx";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/PopoverField.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import { VerticalFieldSelectWithController } from "@/components/Selects/VerticalFieldSelect.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { classCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useAvatarDataGenerator } from "@/hooks/useAvatarDataGenerator.ts";
import type {
  ClassCreationFormSchema,
  ClassCreationInputItem,
} from "@/models/class-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, useEffect, useRef, useState } from "react";
import { useWatch } from "react-hook-form";

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

/**
 * ClassCreationController Component
 *
 * @description This component handles the class creation form, including input management,
 * command handling, and form submission.
 *
 * @param modalMode - Indicates if the component is in modal mode
 * @param inputControllers - The input controllers for the form
 * @param pageId - The unique identifier for the page
 * @param className - Additional class names for styling
 * @param form - The form object for managing form state
 * @param formId - The unique identifier for the form
 * @param props - Additional props
 */
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

  const queryClient = useQueryClient();
  const studentsMemo = useAvatarDataGenerator(form, "studentsValues");
  const primaryTeacherMemo = useAvatarDataGenerator(
    form,
    "primaryTeacherValue"
  );
  const tasksValues =
    useWatch({
      control: form.control,
      name: "tasksValues",
    }) ?? [];

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
    resultsCallback,
  } = useCommandHandler({
    form,
    pageId,
  });

  const cachedKeysRef = useRef<Record<string, unknown[]>>({});
  const selectedDiplomaRef = useRef<CommandItemType | null>(null);

  /**
   * Handle modal close behavior
   *
   * @description Detects when the modal closes and resets the students & primary teacher selections  from the cache
   */
  useEffect(() => {
    const isModalOpen = openedDialogs.includes(pageId);

    if (isModalOpen) return;

    const currentStudentsValues = form.getValues("studentsValues") ?? {};
    const currentPrimaryTeacherValue =
      form.getValues("primaryTeacherValue") ?? {};

    if (Object.keys(currentStudentsValues).length > 0) {
      resetSelectedItemsFromCache(
        cachedKeysRef.current["search-students"],
        currentStudentsValues,
        queryClient
      );
    }

    if (Object.keys(currentPrimaryTeacherValue).length > 0) {
      resetSelectedItemsFromCache(
        cachedKeysRef.current["search-primaryteacher"],
        currentPrimaryTeacherValue,
        queryClient
      );
    }
  }, [openedDialogs]);


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
      metaData?.task === "new-task-template" && linkedDiploma.id !== undefined;

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
    const yearVariable = variables.schoolYear
      .split(" - ")
      .map((s) => s.trim())
      .join("-");
    variables.schoolYear = yearVariable;
    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
      API_ENDPOINTS.POST.CREATE_CLASS.dataReshape
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

    const tasks = new Set(form.getValues("tasks") || []);
    const values = new UniqueSet(null, form.getValues("tasksValues") || []);

    if (values.has(value)) {
      tasks.delete(taskTemplateId);
      values.delete(value);
    } else {
      values.set(value, commandItemDetails);
      tasks.add(taskTemplateId);
    }

    form.setValue("tasksValues", Array.from(values.entries()), {
      shouldValidate: false,
    });

    form.setValue("tasks", Array.from(tasks), { shouldValidate: true });
  };

  /**
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param value - The value of the selected command item
   * @param commandItem - The details of the selected command item
   */
  const handleOnSelect = (value: string, commandItem: CommandItemType) => {
    if (form.watch("degreeConfigId") !== commandItem.id) {
      selectedDiplomaRef.current = commandItem;
      setIsSelectedDiploma(!!commandItem);
      form.setValue("degreeConfigId", commandItem.id, { shouldValidate: true });
      form.setValue("tasks", [], { shouldValidate: true });
      form.setValue("tasksValues", [], { shouldValidate: true });
    }
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
    rest.form = form;
    console.log("opening new students item");

    if (task === "search-students") {
      rest.selectedStudents = form.getValues("studentsValues") ?? {};
    }

    if (task === "search-primaryteacher") {
      rest.selectedPrimaryTeacher = form.getValues("primaryTeacherValue") ?? {};
    }

    if (task === "new-task-template" && selectedDiplomaRef.current) {
      rest.apiEndpoint =
        API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
          selectedDiplomaRef.current.id
        );
      rest.selectedDiploma = selectedDiplomaRef.current;
      const cached = queryClient.getQueryData([task, rest.apiEndpoint]);
      rest.shortTemplatesList = cached?.[0]?.shortTemplatesList ?? [];
    }
    saveKeys([task, rest.apiEndpoint], cachedKeysRef);

    newItemCallback({
      e,
      ...rest,
    });
  };

  const handleOnYearSelect = (value: string, commandItem: CommandItemType) => {
    if (form.watch("schoolYear") !== value) {
      form.setValue("schoolYear", value, { shouldValidate: true });
    }
  };

  const handleDeletingTask = (
    taskValue: string,
    taskDetails?: Record<string, unknown>
  ) => {
    const tasks = new Set(form.getValues("tasks") || []);
    const tasksValues = new Set(form.getValues("tasksValues") || []);
    tasksValues.delete(taskValue);
    form.setValue("tasksValues", Array.from(tasksValues), {
      shouldValidate: true,
    });
    form.setValue("tasks", Array.from(tasks), { shouldValidate: true });
  };

  const controllers = [
    {
      ...inputControllers[4],
      items: studentsMemo,
    },
    {
      ...inputControllers[5],
      items: primaryTeacherMemo,
    },
  ];
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
        items={inputControllers.slice(3, 4)}
        form={form}
        // id={`${pageId}-year`}
        setRef={setRef}
        commandHeadings={resultsCallback()}
        observedRefs={observedRefs}
        onOpenChange={handleOpening}
        onSelect={handleOnSelect}
        onAddNewItem={handleNewItem}
      />
      <AvatarsWithLabelAndAddButtonList
        items={controllers}
        type="button"
        onClick={handleNewItem}
      />
      <Activity mode={isSelectedDiploma ? "visible" : "hidden"}>
        <ControlledDynamicTagList
          form={form}
          setRef={setRef}
          {...inputControllers[2]}
          observedRefs={observedRefs}
          itemList={tasksValues}
          // onRemove={handleCommandSelection}
          onRemove={handleDeletingTask}
        />
        <PopoverFieldWithCommands
          multiSelection
          setRef={setRef}
          onSelect={handleCommandSelection}
          onOpenChange={handleOpening}
          observedRefs={observedRefs}
          onAddNewItem={handleNewItem}
          resetKey={form.watch("degreeConfigId")}
          commandHeadings={resultsCallback()}
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
        onValueChange={handleOnYearSelect}
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
function saveKeys(
  keys: unknown[],
  ref: { current: Record<string, unknown[]> }
) {
  const key = String(keys[0]);
  ref.current = { ...ref.current, [key]: keys };
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
