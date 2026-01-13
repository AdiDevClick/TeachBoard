import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import type { MetaDatasPopoverField } from "@/components/Popovers/types/popover.types.ts";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import { VerticalFieldSelectWithController } from "@/components/Selects/VerticalFieldSelect.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  DEV_MODE,
  NO_CACHE_LOGS,
  NO_QUERY_LOGS,
} from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import type { StepTwoControllerProps } from "@/pages/Evaluations/create/steps/two/types/step-two.types.ts";
import { useEffect } from "react";
import { toast } from "sonner";

export function StepTwoController({
  pageId,
  form,
  formId,
  className,
  inputControllers = [],
}: StepTwoControllerProps) {
  // Placeholder form, replace 'any' with actual form schema
  // const [selected, setSelected] = useState(false);

  // const { onSubmit, isLoading, isLoaded, data, error, setFetchParams } =
  // useFetch();

  const {
    setRef,
    observedRefs,
    newItemCallback,
    openingCallback,
    resultsCallback,
    isLoaded,
    isLoading,
    data,
    error,
  } = useCommandHandler({
    form,
    pageId,
  });

  // /**
  //  * Handles the addition of a new class.
  //  *
  //  * @description A hack is used here to simulate a 'click' effect on the non-selectable item by toggling the `inert` prop and restauring it's state with a slight delay.
  //  *
  //  * You can use this function to add any additional logic needed when the 'Add Class' item is clicked.
  //  *
  //  * @param e - The pointer event triggered on adding a class.
  //  */
  // const onClassAdd = async (e: PointerEvent<HTMLDivElement>) => {
  //   openDialog(e, "class-creation", { userId: user?.userId ?? "" });
  //   setSelected(true);
  //   await wait(150);
  //   setSelected(false);
  // };

  useEffect(() => {
    if (isLoading) {
      toast.loading("Chargement des classes...", { id: loadingName });
    }

    if (data || error) {
      toast.dismiss(loadingName);
      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("useQueryOnSubmit data", data ?? error);
      }
      // You can handle additional side effects here if needed
    }

    if (error) {
      // Errors are handled in onError callback
    }
  }, [data, error, isLoading]);

  // const handleTriggerOpening = (isOpen: boolean) => {
  //   if (isOpen && !isLoaded && !isLoading) {
  //     setFetchParams((prev) => ({
  //       ...prev,
  //       silent: true,
  //       method: API_ENDPOINTS.GET.METHOD,
  //       url: API_ENDPOINTS.GET.CLASSES.endPoints.ALL,
  //       contentId: USER_ACTIVITIES.classes,
  //       dataReshapeFn: API_ENDPOINTS.GET.CLASSES.dataReshape,
  //     }));
  //     onSubmit();
  //   }
  // };

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, fetch data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: MetaDatasPopoverField) => {
    openingCallback(open, metaData);
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

    rest.userId = user?.userId;

    newItemCallback({
      e,
      ...rest,
    });
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
    console.log("selected value :", value, commandItem);
    // if (form.watch("degreeConfigId") !== commandItem.id) {
    //   selectedDiplomaRef.current = commandItem;
    //   setIsSelectedDiploma(!!commandItem);
    //   form.setValue("degreeConfigId", commandItem.id, { shouldValidate: true });
    // }
  };

  return (
    <form id={formId} className={className}>
      <Item>
        <ItemContent>
          <ItemTitle>Step Two Controller Placeholder</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Switch />
        </ItemActions>
        <ItemContent>
          <VerticalFieldSelectWithController
            {...inputControllers[0]}
            setRef={setRef}
            observedRefs={observedRefs}
            form={form}
            // defaultValue={defaultSchoolYear}
            // label="Année scolaire"
            id={`${pageId}-${inputControllers[0].name}-select`}
            // onValueChange={handleOnYearSelect}
          >
            <NonLabelledGroupItem id="task1" name="Task1" />
            <NonLabelledGroupItem id="task2" name="Task2" />
            <NonLabelledGroupItem id="task3" name="Task3" />
            {/* <ListMapper items={data ?? []}>
              <NonLabelledGroupItem />
              <SelectItem value="task1">Task 1</SelectItem>
              <SelectItem value="task2">Task 2</SelectItem>
              <SelectItem value="task3">Task 3</SelectItem>
            </ListMapper> */}
          </VerticalFieldSelectWithController>
        </ItemContent>
      </Item>
    </form>
  );
}
