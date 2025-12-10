import { ClassCreationController } from "@/components/ClassCreation/controller/ClassCreationController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { classCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import type { ClassCreationFormSchema } from "@/models/class-creation.models.ts";
import { classCreationSchema } from "@/models/class-creation.models.ts";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

// export function ClassCreationController({
//   modalMode = false,
//   inputControllers = classCreationInputControllers,
//   ref,
//   pageId = "class-creation",
//   className,
//   ...props
// }: Readonly<PageWithControllers<ClassCreationInputItem>>) {
//   const { openDialog } = useDialog();
//   const { onSubmit } = useClassCreation();
//   // const {
//   //   data: diplomasData,
//   //   error: diplomasError,
//   //   isLoading: isDiplomasLoading,
//   //   isLoaded: isDiplomasLoaded,
//   //   onSubmit: getDiplomas,
//   //   setFetchParams,
//   // } = useFetch();

//   // const { setRef, observedRefs } = useMutationObserver({});
//   const [state, setState] = useState(defaultState);
//   const [isYearOpened, setIsYearOpened] = useState(false);

//   const form = useForm<ClassCreationFormSchema>({
//     resolver: zodResolver(classCreationSchema),
//     mode: "onTouched",
//     defaultValues: {
//       name: "",
//       description: "",
//       schoolYear: defaultSchoolYear,
//     },
//   });

//   const {
//     data: diplomasData,
//     error: diplomasError,
//     isLoading: isDiplomasLoading,
//     isLoaded: isDiplomasLoaded,
//     setRef,
//     observedRefs,
//     submitCallback,
//     fetchParams,
//     data,
//     newItemCallback,
//     openingCallback,
//   } = useCommandHandler({
//     // fetchHooks: useFetch(),
//     form,
//     pageId,
//   });

//   const queryClient = useQueryClient();
//   const resultsCallback = useCallback((keys: any) => {
//     const cachedData = queryClient.getQueryData(keys ?? []);
//     if (DEV_MODE && !NO_CACHE_LOGS) {
//       console.log("Cached data for ", keys, " is ", cachedData);
//     }
//     if (cachedData === undefined) {
//       return data;
//     }
//     return cachedData;
//   }, []);

//   /**
//    * Handle opening of the VerticalFieldSelect component
//    *
//    * @description When opening, fetch data based on the select's meta information
//    *
//    * @param open - Whether the select is opening
//    * @param metaData - The meta data from the popover field that was opened
//    */
//   const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
//     openingCallback(open, metaData, inputs);
//   };

//   const handleSubmit = (variables: DiplomaCreationFormSchema) => {
//     submitCallback(
//       variables,
//       API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint,
//       API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape
//     );
//   };

//   useEffect(() => {
//     if (diplomasData || diplomasError) {
//       if (DEV_MODE) {
//         console.debug("useFetch diplomasData", diplomasData ?? diplomasError);
//       }
//       // You can handle additional side effects here if needed
//     }
//   }, [diplomasData, diplomasError, isDiplomasLoading]);

//   useEffect(() => {
//     if (!pageId || observedRefs.size === 0) return;
//     const observed = observedRefs.get(pageId + "-schoolYear");
//     console.log("Observed for schoolYear:", observed);
//     if (observed) {
//       const el = observed.element as HTMLElement | null;
//       const meta = observed.meta as { name?: string } | undefined;
//       if (el) {
//         console.log(meta?.name === "degreeConfigId");
//         form.setFocus("schoolYear");
//       }
//     }
//   }, [observedRefs, form, pageId]);

//   /**
//    * Determine the title component based on modal mode
//    * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
//    */
//   const Title = modalMode ? DialogHeaderTitle : HeaderTitle;

//   // handleRoleClick removed (popovers handle toggle via onOpenChange)

//   const handleOnDelete = (e: PointerEvent<HTMLButtonElement>) => {
//     preventDefaultAndStopPropagation(e);
//     console.log("Delete role:", state.role);
//     setState(defaultState);
//   };

//   const handleOnEdit = (e: PointerEvent<HTMLButtonElement>) => {
//     preventDefaultAndStopPropagation(e);
//     const roleId = e.currentTarget.id.split("-")[0];
//     const editable = document.getElementById(roleId);
//     if (!editable) return;
//     editable.focus();
//     editable.dataset.isEditing = "true";
//     editable.style.setProperty("user-select", "text");
//     editable.style.setProperty("-webkit-user-modify", "read-write");
//     const newRange = new Range();
//     const selection = globalThis.getSelection();
//     newRange.selectNodeContents(editable);

//     selection?.focusNode;
//     selection?.removeAllRanges();
//     selection?.addRange(newRange);

//     console.log("Edit role:", roleId);

//     setState((prev) => ({
//       ...prev,
//       isEditing: true,
//       prevText: roleId,
//       selected: true,
//       role: roleId,
//     }));
//   };

//   const handleOnValidate = (e: PointerEvent<HTMLButtonElement>) => {
//     preventDefaultAndStopPropagation(e);
//     const role = e.currentTarget.id.split("-")[0];
//     console.log("Validate role edit:", state.role);
//     if (role === state.role) {
//       // cleanup editable state on validate
//       const editable = document.getElementById(role);
//       if (editable) {
//         // editable.removeAttribute("contenteditable");
//         // editable.removeAttribute("data-is-editing");
//         editable.removeAttribute("style");
//         const selection = window.getSelection();
//         selection?.removeAllRanges();
//       }
//       setState(defaultState);
//     }
//   };

//   const handleOnCancel = (e: PointerEvent<HTMLButtonElement>) => {
//     preventDefaultAndStopPropagation(e);
//     console.log("Cancel role edit:", state.role);
//     // // remove contenteditable state
//     // const roleId = (e.currentTarget.id ?? "").split("-")[0];
//     // const editable = document.getElementById(roleId);
//     // if (editable) {
//     //   // editable.removeAttribute("contenteditable");
//     //   // editable.removeAttribute("data-is-editing");
//     //   editable.removeAttribute("style");
//     // }
//     setState((prev) => ({
//       ...prev,
//       isEditing: false,
//       newText: "",
//       prevText: "",
//     }));
//   };

//   const handleOnTextEdited = (e: PointerEvent<HTMLButtonElement>) => {
//     preventDefaultAndStopPropagation(e);
//     const buttonEl = e.currentTarget;
//     const newText = buttonEl.textContent ?? "";

//     console.log(
//       "Text edited for role:",
//       buttonEl.id,
//       "New text:",
//       newText,
//       state
//     );

//     setState((prev) => ({
//       ...prev,
//       newText,
//       isEdited: true,
//       isEditing: false,
//     }));

//     // cleanup contenteditable & attributes
//     buttonEl.removeAttribute("style");
//     // buttonEl.removeAttribute("contenteditable");
//     // buttonEl.removeAttribute("data-is-editing");
//   };

//   const roles = [
//     "serveur",
//     "cuisine",
//     "barman",
//     "caissier",
//     "invite",
//     "testeur",
//   ];

//   const onRoleOpenChange = (open: boolean, role: string) => {
//     if (state.isEditing) return;
//     console.log("openChange");
//     setState(
//       open
//         ? {
//             selected: true,
//             role,
//             isEditing: false,
//             prevText: "",
//             newText: "",
//           }
//         : defaultState
//     );
//   };

//   const handleFocus = (e: PointerEvent<HTMLButtonElement>) => {
//     // preventDefaultAndStopPropagation(e);
//     const editable = e.currentTarget;
//     const roleId = editable.id;
//     editable.focus();
//     editable.dispatchEvent(new KeyboardEvent("keyup", { key: "arrowRight" }));
//     editable.addEventListener(
//       "keyup",
//       (event) => {
//         console.log(event);
//         preventDefaultAndStopPropagation(event);
//         if (event.key === "arrowRight" || event.key === "arrowLeft") {
//           event.target.focus();
//           const selection = window.getSelection();
//           if (!selection) return;
//           const range = document.createRange();
//           range.selectNodeContents(editable);
//           selection.removeAllRanges();
//           selection.addRange(range);
//         }
//       },
//       { once: true }
//     );
//     // editable.style.setProperty("user-select", "text");
//     // editable.style.setProperty("-webkit-user-modify", "read-write");
//     // const editable = document.getElementById(roleId);
//     // if (!editable) return;
//     // editable.style.setProperty("user-select", "none");
//     // editable.style.setProperty("-webkit-user-modify", "read-only");
//   };

//   return (
//     <Card id={pageId} ref={ref} className={className} {...props}>
//       <Title
//         className="text-left!"
//         style={{
//           paddingInline: `calc(var(--spacing) * 6)`,
//         }}
//         title="Créer une classe"
//         description="Ajoutez une nouvelle classe pour commencer à gérer vos élèves et leurs évaluations."
//       />
//       <CardContent>
//         <form
//           ref={(el) => setRef(el, { name: pageId, id: `${pageId}-form` })}
//           id={`${pageId}-form`}
//           onSubmit={form.handleSubmit(handleSubmit)}
//           className="grid gap-4"
//         >
//           <ControlledInputList
//             items={inputControllers.slice(0, 2)}
//             form={form}
//             setRef={setRef}
//           />
//           <PopoverFieldWithControllerAndCommandsList
//             items={inputs}
//             form={form}
//             // id={`${pageId}-year`}
//             setRef={setRef}
//             commandHeadings={resultsCallback([
//               fetchParams.contentId,
//               fetchParams.url,
//             ])}
//             observedRefs={observedRefs}
//             onLoad={(e) => {
//               console.log(e);
//               setIsYearOpened(true);
//             }}
//             onOpenChange={handleOpening}
//             // onOpenChange={(value) => {
//             //   if (value && !isDiplomasLoaded) {
//             //     setFetchParams((prev) => ({
//             //       ...prev,
//             //       url: API_ENDPOINTS.GET.DIPLOMAS,
//             //       contentId: "fetch-diplomas",
//             //     }));
//             //     getDiplomas();
//             //   }
//             // }}
//             onAddNewItem={newItemCallback}
//           >
//             {isYearOpened && (
//               <ListMapper items={years}>
//                 <NonLabelledGroupItem />
//               </ListMapper>
//             )}
//           </PopoverFieldWithControllerAndCommandsList>
//           <ItemGroup id={`${pageId}-roles`} className="grid gap-2">
//             <ItemTitle>Ajouter des rôles</ItemTitle>
//             <Item variant={"default"} className="p-0">
//               <ItemContent className="flex-row flex-wrap gap-2">
//                 <ListMapper items={roles}>
//                   {(rawItem: string | { item: string; id?: string }) => {
//                     const item =
//                       typeof rawItem === "string" ? rawItem : rawItem.item;
//                     return (
//                       <ItemActions key={item} className="relative">
//                         <Popover
//                           open={state.selected && state.role === item}
//                           onOpenChange={(open) => onRoleOpenChange(open, item)}
//                         >
//                           <PopoverTrigger asChild>
//                             <Button
//                               // onBlur={handleOnTextEdited}
//                               // onFocus={handleOnTextEdit}
//                               // onClick={handleFocus}
//                               data-is-editing={
//                                 state.isEditing && state.role === item
//                               }
//                               id={item}
//                               size="sm"
//                               variant="outline"
//                               contentEditable={
//                                 state.isEditing && state.role === item
//                               }
//                             >
//                               {item}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent
//                             side="top"
//                             align="center"
//                             sideOffset={8}
//                             className="p-0.5 w-auto max-h-min-content"
//                           >
//                             {state.isEditing && state.role === item ? (
//                               <>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   id={item + "-validate"}
//                                   onClick={handleOnValidate}
//                                   aria-label={`Valider ${item}`}
//                                 >
//                                   <CheckIcon className="size-4" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   id={item + "-cancel"}
//                                   onClick={handleOnCancel}
//                                   aria-label={`Annuler ${item}`}
//                                 >
//                                   <RotateCcw className="size-4" />
//                                 </Button>
//                               </>
//                             ) : (
//                               state.role === item && (
//                                 <>
//                                   <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     onClick={handleOnEdit}
//                                     id={item + "-edit"}
//                                     aria-label={`Modifier ${item}`}
//                                   >
//                                     <Pencil className="size-4" />
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     onClick={handleOnDelete}
//                                     id={item + "-delete"}
//                                     aria-label={`Supprimer ${item}`}
//                                   >
//                                     <Trash2 className="size-4" />
//                                   </Button>
//                                   <PopoverClose asChild>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       id={item + "-close"}
//                                       aria-label={`Fermer ${item}`}
//                                     >
//                                       <XIcon className="size-4" />
//                                     </Button>
//                                   </PopoverClose>
//                                 </>
//                               )
//                             )}
//                             <PopoverArrow className="fill-popover" />
//                           </PopoverContent>
//                         </Popover>
//                       </ItemActions>
//                     );
//                   }}
//                 </ListMapper>
//               </ItemContent>
//             </Item>
//             <ItemActions className="p-0">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="rounded-full max-h-5"
//               >
//                 <PlusIcon />
//               </Button>
//             </ItemActions>
//           </ItemGroup>
//           <VerticalFieldSelectWithController
//             setRef={setRef}
//             observedRefs={observedRefs}
//             name="schoolYear"
//             form={form}
//             fullWidth={false}
//             placeholder={"defaultSchoolYear"}
//             defaultValue={defaultSchoolYear}
//             label="Année scolaire"
//             id={`${pageId}-schoolYear`}
//           >
//             <ListMapper items={years}>
//               <NonLabelledGroupItem />
//             </ListMapper>
//           </VerticalFieldSelectWithController>
//           {/* {data?.data?.classes.length > 0 && (
//             <>
//               <SelectSeparator />
//               <ListMapper items={data.data.classes}>
//                 <LabelledGroup ischild>
//                   <NonLabelledGroupItem />
//                 </LabelledGroup>
//               </ListMapper>
//             </>
//           )}
//           {/* </VerticalFieldSelect> */}

//           {/* School Year Select */}
//         </form>
//       </CardContent>
//       {/* <CardFooter>
//       {/* Card footer intentionally left empty */}
//       <DialogFooter>
//         <DialogClose asChild className="justify-end">
//           <Button variant="outline">Annuler</Button>
//         </DialogClose>
//         {/* <DialogClose asChild className="justify-end mr-6"> */}
//         <Button
//           variant="outline"
//           className="justify-end mr-6"
//           type="submit"
//           disabled={!form.formState.isValid}
//         >
//           Créer la classe
//         </Button>
//         {/* </DialogClose> */}
//       </DialogFooter>
//     </Card>
//   );
// }

const titleProps = {
  title: "Créer une classe",
  description:
    "Ajoutez une nouvelle classe pour commencer à gérer vos élèves et leurs évaluations.",
};

const footerProps = {
  submitText: "Créer la classe",
};

const year = new Date().getFullYear();
const defaultSchoolYear = year + " - " + (year + 1);

function ClassCreation({
  pageId = "class-creation",
  className = "grid gap-4",
  modalMode = true,
  inputControllers = classCreationInputControllers,
  ...props
}) {
  const formId = pageId + "-form";
  const form = useForm<ClassCreationFormSchema>({
    resolver: zodResolver(classCreationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      schoolYear: defaultSchoolYear,
    },
  });
  const commonProps = useMemo(
    () => ({
      pageId,
      modalMode,
      className,
      form,
      formId,
      titleProps,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      inputControllers,
      ...props,
    }),
    [form.formState, props]
  );
  return <ClassCreationWithCard {...commonProps} />;
}

const ClassCreationWithCard = withTitledCard(ClassCreationController);

export default ClassCreation;
