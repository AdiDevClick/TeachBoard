import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { LabelledGroup } from "@/components/Selects/labelled-group/LabelledGroup.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { SelectItem, SelectSeparator } from "@/components/ui/select.tsx";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useClasses } from "@/hooks/database/classes/useClasses.ts";
import { wait } from "@/utils/utils";
import { SelectIcon } from "@radix-ui/react-select";
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
  const [selected, setSelected] = useState(false);

  const { data, onSubmit, isLoading, isLoaded, error } = useClasses();

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
    openDialog(e, "class-creation");
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
      if (import.meta.env.DEV) {
        console.debug("useQueryOnSubmit data", data ?? error);
      }
      // You can handle additional side effects here if needed
    }

    if (error) {
      // Errors are handled in onError callback
    }
  }, [data, error, isLoading]);

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
          onOpenChange={(value) => {
            if (value && !isLoaded) onSubmit();
          }}
        >
          <SelectItem
            inert={selected}
            value="add-class"
            onPointerDown={onClassAdd}
          >
            Ajouter une classe
            {/* <SelectItemIndicator>...</SelectItemIndicator> */}
            <SelectIcon
              style={{
                flexDirection: "row-reverse",
                flexGrow: 1,
                justifyContent: "space-between",
              }}
            >
              +
            </SelectIcon>
          </SelectItem>
          {data?.data?.classes.length > 0 && (
            <>
              <SelectSeparator />
              <ListMapper items={data.data.classes}>
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
