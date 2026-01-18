import { Badge } from "@/components/ui/badge.tsx";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { Label } from "@/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";

export function StepThreeController({
  pageId,
  className,
  inputControllers = [],
  user,
  preparedStudentsTasksSelection,
  form,
  students,
  selectedClass,
  tasks,
  formId,
  modules,
}) {
  console.log(tasks);
  return (
    <form id={formId}>
      <RadioGroup>
        {/* <VerticalFieldWithInlineSwitchList
        items={preparedStudentsTasksSelection()}
        setRef={setRef}
        observedRefs={observedRefs}
        form={form}
        {...inputControllers[0]}
      /> */}
        {modules.map((item) => (
          <Item key={item.id} variant="outline">
            <ItemContent className="w-full">
              <ItemTitle className="min-w-full">
                <RadioGroupItem id={`r-${item.id}`} value={item.name} />
                <Label className="w-full" htmlFor={`r-${item.id}`}>
                  {item.name}
                </Label>
              </ItemTitle>
              <ItemDescription className="flex">
                <Badge
                  variant="destructive"
                  className="w-4.5 h-4.5 items-center rounded-full mr-2"
                >
                  {item.subSkills?.size ?? 0}
                </Badge>
                <Label className="font-normal" htmlFor={`r-${item.id}`}>
                  Sous-compétences
                </Label>
              </ItemDescription>
            </ItemContent>
          </Item>
          // </Select>
        ))}
      </RadioGroup>
    </form>
  );
}
