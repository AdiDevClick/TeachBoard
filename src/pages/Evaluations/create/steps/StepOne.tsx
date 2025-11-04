import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select.tsx";
import { useQuery } from "@tanstack/react-query";

export function StepOne({ title, placeholder }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await fetch("/api/classes/", {
        method: "GET",
      });

      if (!response.ok || response.status !== 200)
        throw new Error("Network response was not ok");

      return await response.json();
    },
  });

  return (
    <Card className="content__right">
      <CardContent className="right__content-container">
        <VerticalFieldSelect
          className="right__content"
          placeholder={placeholder}
          onValueChange={(value) => console.log(value)}
          label={title}
        >
          {data && (
            <SelectGroup>
              {/* <SelectLabel>BTS</SelectLabel>
            <SelectItem value="class-1ereA">
              1ère A - Sciences de l'Ingénieur
            </SelectItem> */}
              <ListMapper items={data.data}>
                {(item) => (
                  <>
                    <SelectLabel>{item.entityTypeName}</SelectLabel>
                    <SelectItem value={item.id}>{item.name}</SelectItem>
                  </>
                )}
              </ListMapper>
            </SelectGroup>
          )}
        </VerticalFieldSelect>
      </CardContent>
    </Card>
  );
}
