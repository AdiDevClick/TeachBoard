import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { LabelledGroup } from "@/components/Selects/labelled-group/LabelledGroup.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { SelectItem, SelectSeparator } from "@/components/ui/select.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { useQueryOnSubmit } from "@/hooks/queries/useQueryOnSubmit.ts";
import { wait } from "@/lib/utils.ts";
import { SelectIcon } from "@radix-ui/react-select";
import { useEffect, useState, type PointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const loadingName = "load-classes";
export function StepOne({
  title,
  placeholder,
}: {
  readonly title: string;
  readonly placeholder?: string;
}) {
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();

  const { data, queryFn, isLoading, isLoaded, error } = useQueryOnSubmit([
    "classes",
    {
      url: API_ENDPOINTS.GET.CLASSES.ALL,
      method: "GET",
      successDescription: "All classes fetched successfully.",
    },
  ]);

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
    e.preventDefault();
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
        console.debug("useQueryOnSubmit data", data);
      }
      if (data && data.data.length === 0) {
        toast.dismiss();
        toast.info("Aucune classe disponible. \nCréez-en une nouvelle !", {
          style: { whiteSpace: "pre-wrap", zIndex: 10001 },
        });
      }
    }

    if (error) {
      if (error.status === 403) {
        navigate("/login", { replace: true });
        toast.dismiss();
        toast.error(
          `Vous n'avez pas la permission d'accéder à cette ressource. \nVeillez à être connecté avec un compte disposant des droits nécessaires.`,
          { style: { whiteSpace: "pre-wrap" } }
        );
      }
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
            if (value && !isLoaded) queryFn();
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

          <SelectSeparator />
          {data && (
            <ListMapper items={data.data}>
              <LabelledGroup>
                <NonLabelledGroupItem />
              </LabelledGroup>
            </ListMapper>
          )}
        </VerticalFieldSelect>
      </CardContent>
    </Card>
  );
}
