import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { LabelledGroup } from "@/components/Selects/labelled-group/LabelledGroup.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { SelectItem, SelectSeparator } from "@/components/ui/select.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { wait } from "@/utils/utils";
import { PlusIcon } from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";
import { toast } from "sonner";

const loadingName = "load-classes";
export function StepOne({
  title,
  placeholder,
}: {
  readonly title: string;
  readonly placeholder?: string;
}) {
  const { openDialog } = useDialog();
  const user = useAppStore((state) => state.user);
  const [selected, setSelected] = useState(false);

  const { onSubmit, isLoading, isLoaded, data, error, setFetchParams } =
    useFetch();

  /**
   * Handles the addition of a new class.
   *
   * @description A hack is used here to simulate a 'click' effect on the non-selectable item by toggling the `inert` prop and restauring it's state with a slight delay.
   *
   * You can use this function to add any additional logic needed when the 'Add Class' item is clicked.
   *
   * @param e - The pointer event triggered on adding a class.
   */
  const onClassAdd = async (e: PointerEvent<HTMLDivElement>) => {
    openDialog(e, "class-creation", { userId: user?.userId ?? "" });
    setSelected(true);
    await wait(150);
    setSelected(false);
  };

  useEffect(() => {
    if (isLoading) {
      toast.loading("Chargement des classes...", { id: loadingName });
    }

    if (data || error) {
      toast.dismiss(loadingName);
      if (DEV_MODE) {
        console.log(
          (data?.data.classes !== null) | (data?.data.classes !== undefined)
        );
        console.debug("useQueryOnSubmit data", data ?? error);
      }
      // You can handle additional side effects here if needed
    }

    if (error) {
      // Errors are handled in onError callback
    }
  }, [data, error, isLoading]);

  const handleTriggerOpening = (isOpen: boolean) => {
    if (isOpen && !isLoaded && !isLoading) {
      setFetchParams((prev) => ({
        ...prev,
        silent: true,
        method: API_ENDPOINTS.GET.METHOD,
        url: API_ENDPOINTS.GET.CLASSES.endPoints.ALL,
        contentId: USER_ACTIVITIES.classes,
        dataReshape: API_ENDPOINTS.GET.CLASSES.dataReshape,
      }));
      onSubmit();
    }
  };

  return (
    <Card className="content__right">
      <CardContent className="right__content-container">
        <VerticalFieldSelect
          className="right__content"
          placeholder={placeholder}
          onValueChange={(value) => {
            console.log("value => ", value);
          }}
          label={title}
          onOpenChange={handleTriggerOpening}
        >
          <SelectItem
            inert={selected}
            value="add-class"
            onPointerDown={onClassAdd}
          >
            {/* <SelectItemIndicator>...</SelectItemIndicator> */}
            <span className="loneText">Ajouter une classe</span>
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
        </VerticalFieldSelect>
      </CardContent>
    </Card>
  );
}
