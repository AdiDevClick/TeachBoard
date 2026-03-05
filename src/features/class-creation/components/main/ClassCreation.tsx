import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  CLASS_CREATION_INPUT_CONTROLLERS,
  DEFAULT_SCHOOL_YEAR,
  FOOTER_PROPS,
  TITLE_PROPS,
} from "@/features/class-creation/components/main/config/class-creation.configs";
import { ClassCreationController } from "@/features/class-creation/components/main/controllers/ClassCreationController.tsx";
import {
  type ClassCreationFormSchema,
  classCreationSchema,
} from "@/features/class-creation/components/main/models/class-creation.models";
import type { ClassCreationProps } from "@/features/class-creation/components/main/types/class-creation.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentProps } from "react";
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
  inputControllers = CLASS_CREATION_INPUT_CONTROLLERS,
  ...props
}: ClassCreationProps) {
  const form = useForm<ClassCreationFormSchema>({
    resolver: zodResolver(classCreationSchema),
    mode: "onChange",
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

  const commonProps = {
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
  } satisfies ComponentProps<typeof ClassCreationWithCard>;

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
