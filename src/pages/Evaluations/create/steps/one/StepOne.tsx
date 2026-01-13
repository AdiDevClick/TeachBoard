import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { stepOneInputControllers } from "@/data/inputs-controllers.data.ts";
import type { StepOneInputItem } from "@/models/step-one.models.ts";
import { StepOneController } from "@/pages/Evaluations/create/steps/one/controller/StepOneController.tsx";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
export const stepOneTitleProps = {
  // title: "Liste d'élèves",
  // description: "Définir les élèves présents ainsi que leurs fonctions.",
  className: "hidden",
};

/**
 * Step One component for creating evaluations.
 *
 * @param pageId - The ID of the page.
 * @param className - Additional class names for the component.
 * @param modalMode - Whether the component is in modal mode.
 * @param inputControllers - The input controllers for the form.
 * @param props - Additional props.
 */
export function StepOne({
  pageId,
  className = "content__right",
  modalMode = false,
  inputControllers = stepOneInputControllers,
  ...props
}: Readonly<PageWithControllers<StepOneInputItem>>) {
  const commonProps = {
    pageId,
    modalMode,
    className,
    inputControllers,
    titleProps: stepOneTitleProps,
    contentClassName: "right__content-container",
    ...props,
  };

  return <StepOneWithCard displayFooter={false} {...commonProps} />;
  // <Card className="content__right">
  //   <CardContent className="right__content-container">
  //     <PopoverFieldWithCommands
  //       {...stepOneInputControllers[0]}
  //       // form={form}
  //       // id={`${pageId}-year`}
  //       setRef={setRef}
  //       commandHeadings={resultsCallback()}
  //       observedRefs={observedRefs}
  //       onOpenChange={handleOpening}
  //       onSelect={handleOnSelect}
  //       onAddNewItem={handleNewItem}
  //     />
  //     {/*<VerticalFieldSelect
  //       className="right__content"
  //       placeholder={placeholder}
  //       onValueChange={(value) => {
  //         console.log("value => ", value);
  //       }}
  //       label={title}
  //       // onOpenChange={handleTriggerOpening}
  //     >
  //       <SelectItem
  //         inert={selected}
  //         value="add-class"
  //         onPointerDown={onClassAdd}
  //       >
  //         {/* <SelectItemIndicator>...</SelectItemIndicator> */}
  //     {/*} <span className="loneText">Ajouter une classe</span>
  //         <Button
  //           variant="ghost"
  //           size="icon-sm"
  //           className="rounded-full max-h-2"
  //         >
  //           <PlusIcon />
  //         </Button>
  //       </SelectItem>
  //       {data?.items !== null &&
  //         data?.items !== undefined &&
  //         data?.items.length > 0 && (
  //           <>
  //             <SelectSeparator />
  //             <ListMapper items={data?.items}>
  //               <LabelledGroup ischild>
  //                 <NonLabelledGroupItem />
  //               </LabelledGroup>
  //             </ListMapper>
  //           </>
  //         )}
  //     </VerticalFieldSelect>*/}
  //   </CardContent>
  // </Card>
}

const StepOneWithCard = withTitledCard(StepOneController);
