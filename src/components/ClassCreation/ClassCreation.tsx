import { ClassCreationController } from "@/components/ClassCreation/controller/ClassCreationController.tsx";
import type { ClassCreationProps } from "@/components/ClassCreation/types/class-creation.types.ts";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { classCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import type { ClassCreationFormSchema } from "@/models/class-creation.models.ts";
import { classCreationSchema } from "@/models/class-creation.models.ts";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Créer une classe",
  description:
    "Ajoutez une nouvelle classe pour commencer à gérer vos élèves et leurs évaluations.",
};

const footerProps = {
  submitText: "Créer la classe",
};

const year = new Date().getFullYear();
const defaultSchoolYear = year + " - " + (year + 1);

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
      schoolYear: defaultSchoolYear,
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
      titleProps,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      inputControllers,
      ...props,
      form,
    }),
    [form.formState, props]
  );
  return <ClassCreationWithCard {...commonProps} />;
}

const ClassCreationWithCard = withTitledCard(ClassCreationController);

export default ClassCreation;
