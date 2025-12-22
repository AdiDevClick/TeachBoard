import { SearchStudentsController } from "@/components/ClassCreation/students/controller/SearchStudentsController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  searchStudentsSchema,
  type SearchStudentsFormSchema,
} from "@/models/search-students.models.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Recherche d'étudiants",
  description:
    "Recherchez et sélectionnez des étudiants pour les ajouter à la classe.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

/**
 * SearchStudents Component
 *
 * @param pageId - The unique identifier for the page/component using this controller
 * @param modalMode - Whether the component is used in a modal dialog or not
 */
function SearchStudents({
  pageId = "search-students",
  modalMode = true,
  ...props
}) {
  const form = useForm<SearchStudentsFormSchema>({
    resolver: zodResolver(searchStudentsSchema),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });
  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      form,
      formId,
      modalMode,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      titleProps,
      ...props,
    }),
    [props]
  );

  return <SearchStudentsWithCard {...commonProps} />;
}

const SearchStudentsWithCard = withTitledCard(SearchStudentsController);

export default SearchStudents;
