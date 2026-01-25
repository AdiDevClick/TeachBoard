import { SearchStudentsController } from "@/components/ClassCreation/students/controller/SearchStudentsController.tsx";
import type { SearchStudentsProps } from "@/components/ClassCreation/students/types/search-students.types.ts";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  type SearchStudentsFormSchema,
  searchStudentsSchema,
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
 * @param props - Additional props to be passed to the SearchStudents component
 */
function SearchStudents({
  pageId = "search-students",
  modalMode = true,
  className = "display-none",
  ...props
}: SearchStudentsProps) {
  const localForm = useForm<SearchStudentsFormSchema>({
    resolver: zodResolver(searchStudentsSchema),
    mode: "onTouched",
    defaultValues: {
      students: props.form?.watch("students") ?? [],
    },
  });

  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      formId,
      localForm,
      className,
      footerProps: {
        ...footerProps,
        formState: localForm.formState,
        formId,
      },
      cardProps: { className },
      modalMode,
      titleProps,
      ...props,
    }),
    [props, props.form, localForm],
  );

  return <SearchStudentsWithCard {...commonProps} />;
}

const SearchStudentsWithCard = withTitledCard(SearchStudentsController);

export default SearchStudents;
