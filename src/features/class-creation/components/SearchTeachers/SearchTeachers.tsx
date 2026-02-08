import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  SEARCH_TEACHERS_FOOTER,
  SEARCH_TEACHERS_TITLE,
} from "@/features/class-creation/components/SearchTeachers/config/search-teachers.configs";
import { SearchPrimaryTeacherController } from "@/features/class-creation/components/SearchTeachers/controllers/SearchTeachersController.tsx";
import {
  type SearchPrimaryTeacherFormSchema,
  SearchPrimaryTeacherSchema,
} from "@/features/class-creation/components/SearchTeachers/models/search-teachers.models";
import type { SearchPrimaryTeacherProps } from "@/features/class-creation/components/SearchTeachers/types/search-teachers.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

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

  const commonProps = {
    pageId,
    formId,
    localForm,
    modalMode,
    className,
    ...props,
    form: props.form as UseFormReturn<any>,
    card: {
      card: { className },
      title: SEARCH_TEACHERS_TITLE,
      footer: {
        ...SEARCH_TEACHERS_FOOTER,
        formState: localForm.formState,
        formId,
      },
    },
  };

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
