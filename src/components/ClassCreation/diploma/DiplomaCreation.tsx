import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { VerticalRefSetters } from "@/components/Selects/types/select.types.ts";
import {
  VerticalFieldSelectWithCommands,
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
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { diplomaCreationSchema } from "@/models/diploma-creation.models.ts";
import type { SignupInputItem } from "@/pages/Signup/types/signup.types.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  Pencil,
  PlusIcon,
  RotateCcw,
  Trash2,
  XIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { useForm } from "react-hook-form";

const inputs = [
  {
    task: "add-diploma-field",
    name: "diplomaField",
    label: "Métier / Domaine du diplôme",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un métier ou domaine",
    useButtonAddNew: true,
    useCommands: true,
    apiEndpoint: "/field",
    id: "diploma-field-input",
  },
  {
    task: "add-school-year",
    name: "schoolYear",
    label: "Année scolaire",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter une année scolaire",
    useButtonAddNew: true,
    useCommands: true,
    apiEndpoint: "/year",
    id: "school-year-input",
  },
  {
    task: "add-school-level",
    name: "schoolLevel",
    label: "Diplôme / Niveau scolaire",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un niveau scolaire",
    useButtonAddNew: true,
    useCommands: true,
    apiEndpoint: "/level",
    id: "school-level-input",
  },
] satisfies Parameters<typeof VerticalFieldSelectWithCommands>[];

const defaultState = {
  selected: false,
  role: "",
  isEditing: false,
  prevText: "",
  newText: "",
};

export type HandleAddNewItemParams = {
  e: PointerEvent<HTMLElement>;
  apiEndpoint?: (typeof inputs)[number]["apiEndpoint"];
  task: (typeof inputs)[number]["task"];
};

export function DiplomaCreation({
  pageId = "diploma-creation-page-card",
  modalMode = true,
  className,
  inputControllers,
  ...props
}: Readonly<PageWithControllers<SignupInputItem>>) {
  const {
    onSubmit,
    fetchParams,
    data,
    error,
    isLoading,
    isLoaded,
    setFetchParams,
  } = useFetch();
  const { openDialog } = useDialog();
  const queryClient = useQueryClient();
  const [state, setState] = useState(defaultState);
  const { setRef, observedRefs } = useMutationObserver({});

  const resultsCallback = useCallback((keys: any) => {
    const cachedData = queryClient.getQueryData(keys ?? []);
    if (DEV_MODE) {
      console.log("Cached data for ", keys, " is ", cachedData);
    }
    if (cachedData === undefined) {
      return data;
    }
    return cachedData;
  }, []);

  const form = useForm<{
    diploma: string;
    schoolYear: string;
    schoolLevel: string;
    mainSkills: string[];
  }>({
    resolver: zodResolver(diplomaCreationSchema),
    mode: "onTouched",
    defaultValues: {
      diploma: "",
      schoolYear: "",
      schoolLevel: "",
      mainSkills: [],
    },
  });
  const VerticalFieldSelectRef = useRef<VerticalRefSetters>(null!);

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

    const selection = window.getSelection();
    newRange.selectNodeContents(editable);

    selection?.focusNode;
    selection?.removeAllRanges();
    selection?.addRange(newRange);

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

  const handleOnCancel = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    setState((prev) => ({
      ...prev,
      isEditing: false,
      newText: "",
      prevText: "",
    }));
  };

  const handleAddNewItem = ({
    e,
    apiEndpoint,
    task,
  }: HandleAddNewItemParams) => {
    if (DEV_MODE) {
      console.log("Add new item triggered", {
        apiEndpoint,
        task,
      });
    }
    openDialog(e, "new-degree-item-dialog");
  };

  useEffect(() => {
    const keys = [fetchParams.contentId, fetchParams.url];

    if (keys[1] === "" && keys[0] === "none") return;
    const cachedData = queryClient.getQueryData(keys ?? []);

    if (cachedData === undefined) {
      onSubmit();
    }
  }, [fetchParams]);

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @param open - Whether the select is opening
   * @returns
   */
  const handleOpening = (open: boolean) => {
    if (!open) return;
    const metaData = VerticalFieldSelectRef.current.getMeta();

    const task = metaData?.task;
    const apiEndpoint = metaData?.apiEndpoint;

    // Ensure apiEndpoint is present and correspond to a known input
    const found = inputs.find(
      (input) => input.task === task && input.apiEndpoint === apiEndpoint
    );
    if (!found) return;

    if (DEV_MODE) {
      console.log("handleOpening diploma creation & Fetching ", metaData);
    }

    setFetchParams((prev) => ({
      ...prev,
      url: API_ENDPOINTS.GET.DEGREES + apiEndpoint,
      contentId: "fetch-diplomas",
    }));
  };

  useEffect(() => {
    if (isLoaded && !error && data) {
      if (DEV_MODE) {
        console.log("Diploma creation fetched data:", data, fetchParams);
      }
    }
  }, [isLoaded, error, data]);

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;

  const skills = ["P1", "P2", "P3", "P4", "P5", "P6"];

  return (
    <Card
      id={pageId}
      {...props}
      className={className}
      style={{ justifySelf: "center" }}
    >
      <Title
        className="text-left!"
        style={{
          paddingInline: `calc(var(--spacing) * 6)`,
        }}
        title="Création de diplômes ou certifications"
        description="Ajoutez des compétences en lien avec la certification et l'année scolaire pour vos élèves."
      />
      <CardContent>
        <form
          id={pageId + "-form"}
          className="grid gap-4"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <VerticalFieldSelectWithControllerAndCommandsList
            items={inputs}
            form={form}
            commandHeadings={resultsCallback(
              [fetchParams.contentId, fetchParams.url] ?? []
            )}
            // queryRecordsKey={memoizedQueryRecordsKeys.cachedKeys}
            onOpenChange={handleOpening}
            onValueChange={() =>
              console.log(
                "value changed ->",
                VerticalFieldSelectRef.current?.getLastSelectedItemValue()
              )
            }
            setRef={setRef}
            observedRefs={observedRefs}
            controllerRef={VerticalFieldSelectRef}
            onAddNewItem={handleAddNewItem}
          />
          <ItemGroup id={`${pageId}-roles`} className="grid gap-2">
            <ItemTitle>Compétences principales</ItemTitle>
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
        </form>
      </CardContent>
      <DialogFooter>
        <DialogClose asChild className="justify-end">
          <Button variant="outline">Annuler</Button>
        </DialogClose>
        <Button
          variant="outline"
          className="justify-end mr-6"
          type="submit"
          disabled={!form.formState.isValid}
        >
          Créer le diplôme
        </Button>
      </DialogFooter>
    </Card>
  );
}
