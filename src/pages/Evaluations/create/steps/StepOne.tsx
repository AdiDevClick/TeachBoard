import type { ListMapper } from "@/components/Lists/ListMapper.tsx";
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
        // cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      return response.json();
    },
  });

  console.log(data);

  return (
    <Card className="content__right">
      <CardContent className="right__content-container">
        <VerticalFieldSelect
          className="right__content"
          placeholder={placeholder}
          onValueChange={(value) => console.log(value)}
          label={title}
        >
          <SelectGroup>
            {/* <SelectLabel>BTS</SelectLabel>
            <SelectItem value="class-1ereA">
              1ère A - Sciences de l'Ingénieur
            </SelectItem> */}
            <ListMapper items={data}>
              {(item) => (
                <>
                  <SelectLabel>{item.label}</SelectLabel>
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                </>
              )}
            </ListMapper>
          </SelectGroup>
        </VerticalFieldSelect>
      </CardContent>
    </Card>
  );
}
