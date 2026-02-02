import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  DEFAULT_SCHOOL_YEAR,
  FOOTER_PROPS,
  TITLE_PROPS,
} from "@/features/class-creation/components/main/config/class-creation.configs";
import { ClassCreationController } from "@/features/class-creation/components/main/controllers/ClassCreationController.tsx";
import type { ClassCreationProps } from "@/features/class-creation/components/main/types/class-creation.types.ts";
import {
  classCreationInputControllers,
  classCreationSchema,
  type ClassCreationFormSchema,
} from "@/features/class-creation/index.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

/**
 * Class creation component.
 *
 * @param pageId - The ID of the page.
 * @param className - Additional CSS classes for styling.
 * @param modalMode - Whether the form is in modal mode.
 * @param inputControllers - The input controllers for the form.
 */
function ClassCreation({
  pageId = "class-creation",
  className = "grid gap-4",
  modalMode = true,
  inputControllers = classCreationInputControllers,
  ...props
}: ClassCreationProps) {
  const form = useForm<ClassCreationFormSchema>({
    resolver: zodResolver(classCreationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      schoolYear: DEFAULT_SCHOOL_YEAR,
      students: [],
      degreeConfigId: "",
      userId: props.userId ?? "",
      primaryTeacherId: "",
      tasks: [],
    },
  });
  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      modalMode,
      className,
      formId,
      card: {
        card: { className },
        title: TITLE_PROPS,
        footer: {
          ...FOOTER_PROPS,
          formState: form.formState,
          formId,
        },
      },
      inputControllers,
      ...props,
      form,
      submitRoute: API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
      submitDataReshapeFn: API_ENDPOINTS.POST.CREATE_CLASS.dataReshape,
    }),
    [form.formState, props],
  );
  return (
    <ClassCreationWithCard {...commonProps}>
      <ClassCreationWithCard.Title />
      <ClassCreationWithCard.Content />
      <ClassCreationWithCard.Footer />
    </ClassCreationWithCard>
  );
}

const ClassCreationWithCard = withTitledCard(ClassCreationController);

export default ClassCreation;
