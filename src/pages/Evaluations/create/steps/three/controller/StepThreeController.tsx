import { Label } from "@/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";

export function StepThreeController({
  pageId,
  modalMode,
  className,
  inputControllers = [],
  user,
  preparedStudentsTasksSelection,
  form,
  students,
  selectedClass,
  tasks,
  formId,
  setRef,
  observedRefs,
}) {
  console.log(tasks);
  return (
    <form id={formId} className={className}>
      <RadioGroup>
        {/* <VerticalFieldWithInlineSwitchList
        items={preparedStudentsTasksSelection()}
        setRef={setRef}
        observedRefs={observedRefs}
        form={form}
        {...inputControllers[0]}
      /> */}
        {preparedStudentsTasksSelection()?.map((item) => (
          <div className="flex items-center gap-3" key={item?.id}>
            <RadioGroupItem
              id={`r-${item?.id}`}
              value={item?.fullName}
              // className="radio-item"
            >
              {/* <Radio className="radio-item__icon" /> */}
              {/* <Radio className="radio-item__icon" /> */}
            </RadioGroupItem>
            <Label htmlFor={`r-${item?.id}`}>
              {/* <Label htmlFor={`r${item.id}`} className="radio-item__label"> */}
              {item?.fullName}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </form>
  );
}
