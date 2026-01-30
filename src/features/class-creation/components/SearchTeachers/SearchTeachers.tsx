import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { SearchPrimaryTeacherController } from "@/features/class-creation/components/SearchTeachers/controllers/SearchTeachersController.tsx";
import {
  type SearchPrimaryTeacherFormSchema,
  SearchPrimaryTeacherSchema,
} from "@/features/class-creation/components/SearchTeachers/models/search-teachers.models";
import type { SearchPrimaryTeacherProps } from "@/features/class-creation/components/SearchTeachers/types/search-teachers.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

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
export function SearchPrimaryTeacher({
  pageId = "search-primaryteacher",
  modalMode = true,
  className = "display-none",
  ...props
}: SearchPrimaryTeacherProps) {
  const localForm = useForm<SearchPrimaryTeacherFormSchema>({
    resolver: zodResolver(SearchPrimaryTeacherSchema),
    mode: "onTouched",
    defaultValues: {
      primaryTeacherId: props.form?.watch("primaryTeacherId"),
    },
  });
  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      formId,
      localForm,
      modalMode,
      className,
      ...props,
      form: props.form as UseFormReturn<any>,
      card: {
        card: { className },
        title: titleProps,
        footer: {
          ...footerProps,
          formState: localForm.formState,
          formId,
        },
      },
    }),
    [props],
  );

  return (
    <SearchPrimaryTeacherWithCard {...commonProps}>
      <SearchPrimaryTeacherWithCard.Title />
      <SearchPrimaryTeacherWithCard.Content />
      <SearchPrimaryTeacherWithCard.Footer />
    </SearchPrimaryTeacherWithCard>
  );
}

const SearchPrimaryTeacherWithCard = withTitledCard(
  SearchPrimaryTeacherController,
);
