import { SearchStudentsController } from "@/components/ClassCreation/students/controller/SearchStudentsController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { taskTemplateCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import {
  type TaskTemplateCreationFormSchema,
  taskTemplateSchema,
} from "@/models/class-task-template.models.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Recherche d'étudiants",
  description:
    "Recherchez et sélectionnez des étudiants pour les ajouter à la classe.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

function SearchStudents({
  pageId = "search-students",
  modalMode = true,
  inputControllers = taskTemplateCreationInputControllers,
  ...props
}) {
  const form = useForm<TaskTemplateCreationFormSchema>({
    resolver: zodResolver(taskTemplateSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      taskId: "",
      degreeConfigId: "",
      skills: [],
    },
  });
  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      form,
      modalMode,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      titleProps,
      ...props,
    }),
    [form.formState, props]
  );

  return <SearchStudentsWithCard {...commonProps} />;
}

const SearchStudentsWithCard = withTitledCard(SearchStudentsController);

export default SearchStudents;
