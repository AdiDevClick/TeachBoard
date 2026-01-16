import { VerticalFieldWithInlineSwitchList } from "@/components/Selects/VerticalFieldSelect.tsx";

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
  return (
    <form id={formId} className={className}>
      <VerticalFieldWithInlineSwitchList
        items={preparedStudentsTasksSelection()}
        setRef={setRef}
        observedRefs={observedRefs}
        form={form}
        {...inputControllers[0]}
      />
    </form>
  );
}
