import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import {
  VerticalFieldSelectWithController,
  VerticalFieldSelectWithControllerAndCommandsList,
} from "@/components/Selects/VerticalFieldSelect.tsx";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DialogClose, DialogFooter } from "@/components/ui/dialog.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE } from "@/configs/app.config.ts";
import { classCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useClassCreation } from "@/hooks/database/classes/useClassCreation.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import type {
  ClassCreationFormSchema,
  ClassCreationInputItem,
} from "@/models/class-creation.models.ts";
import { classCreationSchema } from "@/models/class-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverArrow, PopoverClose } from "@radix-ui/react-popover";
import {
  CheckIcon,
  Pencil,
  PlusIcon,
  RotateCcw,
  Trash2,
  XIcon,
} from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";
import { useForm } from "react-hook-form";

const year = new Date().getFullYear();
const years = yearsListRange(year, 5);
const defaultSchoolYear = year + " - " + (year + 1);

const inputs = [
  {
    // Required for withController to be able to process the field
    name: "degreeConfigId",
    label: "Année et niveau du diplôme",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un diplôme",
    task: "add-diploma",
    useCommands: true,
    fullWidth: true,
    useButtonAddNew: true,
  },
  {
    // Required for withController to be able to process the field
    // The "students" field can hold an array of selected student ids (or similar)
    name: "students",
    label: "Elèves",
    task: "add-students",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter des élèves",
    useCommands: false,
    fullWidth: true,
    useButtonAddNew: true,
  },
  {
    name: "schoolYear",
    label: "Année scolaire",
    task: "add-school-year",
    placeholder: defaultSchoolYear,
    defaultValue: defaultSchoolYear,
    creationButtonText: false,
    useCommands: false,
    fullWidth: false,
    useButtonAddNew: false,
  },
];

const defaultState = {
  selected: false,
  role: "",
  isEditing: false,
  prevText: "",
  newText: "",
  // isEdited: false,  // removed - we handle edit state via isEditing and newText
};

export function ClassCreation({
  modalMode = false,
  inputControllers = classCreationInputControllers,
  ref,
  pageId = "class-creation-page-card",
  className,
  ...props
}: Readonly<PageWithControllers<ClassCreationInputItem>>) {
  const { openDialog } = useDialog();
  const { onSubmit } = useClassCreation();
  const {
    data: diplomasData,
    error: diplomasError,
    isLoading: isDiplomasLoading,
    isLoaded: isDiplomasLoaded,
    onSubmit: getDiplomas,
    setFetchParams,
  } = useFetch();

  const { setRef, observedRefs } = useMutationObserver({});
  const [state, setState] = useState(defaultState);
  const [isYearOpened, setIsYearOpened] = useState(false);

  const form = useForm<ClassCreationFormSchema>({
    resolver: zodResolver(classCreationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      schoolYear: defaultSchoolYear,
    },
  });

  const handleNewDiploma = async ({
    e,
  }: {
    e: PointerEvent<HTMLDivElement>;
  }) => {
    openDialog(e, "create-diploma");
    console.log("Je create un diploma");
    // setSelected(true);
    // await wait(150);
    // References to the open panels per role so we can focus them and trap blur

    // Close the panel when clicking outside of it or the opening button
  };

  useEffect(() => {
    if (diplomasData || diplomasError) {
      if (DEV_MODE) {
        console.debug("useFetch diplomasData", diplomasData ?? diplomasError);
      }
      // You can handle additional side effects here if needed
    }
  }, [diplomasData, diplomasError, isDiplomasLoading]);

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
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;

  // handleRoleClick removed (popovers handle toggle via onOpenChange)

  const handleOnDelete = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    console.log("Delete role:", state.role);
    setState(defaultState);
  };

  const handleOnEdit = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    const roleId = e.currentTarget.id.split("-")[0];
    const editable = document.getElementById(roleId);
    if (!editable) return;
    editable.focus();
    editable.dataset.isEditing = "true";
    editable.style.setProperty("user-select", "text");
    editable.style.setProperty("-webkit-user-modify", "read-write");
    const newRange = new Range();
    const selection = globalThis.getSelection();
    newRange.selectNodeContents(editable);

    selection?.focusNode;
    selection?.removeAllRanges();
    selection?.addRange(newRange);

    console.log("Edit role:", roleId);

    setState((prev) => ({
      ...prev,
      isEditing: true,
      prevText: roleId,
      selected: true,
      role: roleId,
    }));
  };

  const handleOnValidate = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    const role = e.currentTarget.id.split("-")[0];
    console.log("Validate role edit:", state.role);
    if (role === state.role) {
      // cleanup editable state on validate
      const editable = document.getElementById(role);
      if (editable) {
        // editable.removeAttribute("contenteditable");
        // editable.removeAttribute("data-is-editing");
        editable.removeAttribute("style");
        const selection = window.getSelection();
        selection?.removeAllRanges();
      }
      setState(defaultState);
    }
  };

  const handleOnCancel = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    console.log("Cancel role edit:", state.role);
    // // remove contenteditable state
    // const roleId = (e.currentTarget.id ?? "").split("-")[0];
    // const editable = document.getElementById(roleId);
    // if (editable) {
    //   // editable.removeAttribute("contenteditable");
    //   // editable.removeAttribute("data-is-editing");
    //   editable.removeAttribute("style");
    // }
    setState((prev) => ({
      ...prev,
      isEditing: false,
      newText: "",
      prevText: "",
    }));
  };

  const handleOnTextEdited = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    const buttonEl = e.currentTarget;
    const newText = buttonEl.textContent ?? "";

    console.log(
      "Text edited for role:",
      buttonEl.id,
      "New text:",
      newText,
      state
    );

    setState((prev) => ({
      ...prev,
      newText,
      isEdited: true,
      isEditing: false,
    }));

    // cleanup contenteditable & attributes
    buttonEl.removeAttribute("style");
    // buttonEl.removeAttribute("contenteditable");
    // buttonEl.removeAttribute("data-is-editing");
  };

  const roles = [
    "serveur",
    "cuisine",
    "barman",
    "caissier",
    "invite",
    "testeur",
  ];

  const onRoleOpenChange = (open: boolean, role: string) => {
    if (state.isEditing) return;
    console.log("openChange");
    setState(
      open
        ? {
            selected: true,
            role,
            isEditing: false,
            prevText: "",
            newText: "",
          }
        : defaultState
    );
  };

  const handleFocus = (e: PointerEvent<HTMLButtonElement>) => {
    // preventDefaultAndStopPropagation(e);
    const editable = e.currentTarget;
    const roleId = editable.id;
    editable.focus();
    editable.dispatchEvent(new KeyboardEvent("keyup", { key: "arrowRight" }));
    editable.addEventListener(
      "keyup",
      (event) => {
        console.log(event);
        preventDefaultAndStopPropagation(event);
        if (event.key === "arrowRight" || event.key === "arrowLeft") {
          event.target.focus();
          const selection = window.getSelection();
          if (!selection) return;
          const range = document.createRange();
          range.selectNodeContents(editable);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      },
      { once: true }
    );
    // editable.style.setProperty("user-select", "text");
    // editable.style.setProperty("-webkit-user-modify", "read-write");
    // const editable = document.getElementById(roleId);
    // if (!editable) return;
    // editable.style.setProperty("user-select", "none");
    // editable.style.setProperty("-webkit-user-modify", "read-only");
  };

  return (
    <Card id={pageId} ref={ref} className={className} {...props}>
      <Title
        className="text-left!"
        style={{
          paddingInline: `calc(var(--spacing) * 6)`,
        }}
        title="Créer une classe"
        description="Ajoutez une nouvelle classe pour commencer à gérer vos élèves et leurs évaluations."
      />
      <CardContent>
        <form
          ref={(el) => setRef(el, { name: pageId, id: `${pageId}-form` })}
          id={`${pageId}-form`}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <ControlledInputList
            items={inputControllers}
            form={form}
            setRef={setRef}
          />
          <VerticalFieldSelectWithControllerAndCommandsList
            items={inputs}
            form={form}
            id={`${pageId}-year`}
            setRef={setRef}
            observedRefs={observedRefs}
            onLoad={(e) => {
              console.log(e);
              setIsYearOpened(true);
            }}
            onOpenChange={(value) => {
              if (value && !isDiplomasLoaded) {
                setFetchParams((prev) => ({
                  ...prev,
                  url: API_ENDPOINTS.GET.DIPLOMAS,
                  contentId: "fetch-diplomas",
                }));
                getDiplomas();
              }
            }}
            onAddNewItem={handleNewDiploma}
          >
            {isYearOpened && (
              <ListMapper items={years}>
                <NonLabelledGroupItem />
              </ListMapper>
            )}
          </VerticalFieldSelectWithControllerAndCommandsList>
          <ItemGroup id={`${pageId}-roles`} className="grid gap-2">
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
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full max-h-5"
              >
                <PlusIcon />
              </Button>
            </ItemActions>
          </ItemGroup>
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
      </CardContent>
      {/* <CardFooter>
      {/* Card footer intentionally left empty */}
      <DialogFooter>
        <DialogClose asChild className="justify-end">
          <Button variant="outline">Annuler</Button>
        </DialogClose>
        {/* <DialogClose asChild className="justify-end mr-6"> */}
        <Button
          variant="outline"
          className="justify-end mr-6"
          type="submit"
          disabled={!form.formState.isValid}
        >
          Créer la classe
        </Button>
        {/* </DialogClose> */}
      </DialogFooter>
    </Card>
  );
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
