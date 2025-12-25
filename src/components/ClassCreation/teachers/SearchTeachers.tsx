import { SearchTeachersController } from "@/components/ClassCreation/teachers/controller/SearchTeachersController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  type SearchTeachersFormSchema,
  searchTeachersSchema,
} from "@/models/search-teachers.models.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Recherche de professeurs",
  description:
    "Recherchez et sélectionnez un professeur principal pour la classe.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

/**
 * SearchTeachers Component
 *
 * @param pageId - The unique identifier for the page/component using this controller
 * @param modalMode - Whether the component is used in a modal dialog or not
 */
export function SearchTeachers({
  pageId = "search-teachers",
  modalMode = true,
  ...props
}) {
  const localForm = useForm<SearchTeachersFormSchema>({
    resolver: zodResolver(searchTeachersSchema),
    mode: "onTouched",
    defaultValues: {
      teacher: props.form?.watch("teacher") ?? [],
    },
  });
  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      formId,
      localForm,
      modalMode,
      footerProps: {
        ...footerProps,
        formState: localForm.formState,
        formId,
      },
      titleProps,
      ...props,
    }),
    [props]
  );

  return <SearchTeachersWithCard {...commonProps} />;
}

const SearchTeachersWithCard = withTitledCard(SearchTeachersController);
