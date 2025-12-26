import type { HandleAddNewItemParams } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { PopoverFieldWithCommands } from "@/components/Popovers/PopoverField.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { stepOneInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const loadingName = "load-classes";
export function StepOne({
  title,
  placeholder,
}: {
  readonly title: string;
  readonly placeholder?: string;
}) {
  // const { openDialog } = useDialog();
  const user = useAppStore((state) => state.user);
  // const [selected, setSelected] = useState(false);

  // const { onSubmit, isLoading, isLoaded, data, error, setFetchParams } =
  // useFetch();

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
    form: null,
    pageId: title,
  });

  const queryClient = useQueryClient();

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

  // useEffect(() => {
  //   if (isLoading) {
  //     toast.loading("Chargement des classes...", { id: loadingName });
  //   }

  //   if (data || error) {
  //     toast.dismiss(loadingName);
  //     if (DEV_MODE) {
  //       console.log(
  //         (data?.data.classes !== null) | (data?.data.classes !== undefined)
  //       );
  //       console.debug("useQueryOnSubmit data", data ?? error);
  //     }
  //     // You can handle additional side effects here if needed
  //   }

  //   if (error) {
  //     // Errors are handled in onError callback
  //   }
  // }, [data, error, isLoading]);

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
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    openingCallback(open, metaData, stepOneInputControllers);
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
    <Card className="content__right">
      <CardContent className="right__content-container">
        <PopoverFieldWithCommands
          className="right__content"
          {...stepOneInputControllers[0]}
          // form={form}
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
        {/*<VerticalFieldSelect
          className="right__content"
          placeholder={placeholder}
          onValueChange={(value) => {
            console.log("value => ", value);
          }}
          label={title}
          // onOpenChange={handleTriggerOpening}
        >
          <SelectItem
            inert={selected}
            value="add-class"
            onPointerDown={onClassAdd}
          >
            {/* <SelectItemIndicator>...</SelectItemIndicator> */}
        {/*} <span className="loneText">Ajouter une classe</span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full max-h-2"
            >
              <PlusIcon />
            </Button>
          </SelectItem>
          {data?.items !== null &&
            data?.items !== undefined &&
            data?.items.length > 0 && (
              <>
                <SelectSeparator />
                <ListMapper items={data?.items}>
                  <LabelledGroup ischild>
                    <NonLabelledGroupItem />
                  </LabelledGroup>
                </ListMapper>
              </>
            )}
        </VerticalFieldSelect>*/}
      </CardContent>
    </Card>
  );
}
