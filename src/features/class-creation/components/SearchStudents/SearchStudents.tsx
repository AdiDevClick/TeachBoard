import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  SEARCH_STUDENTS_TITLE,
  SEARCH_STUDENTS_FOOTER,
} from "@/features/class-creation/components/SearchStudents/config/search-students.configs";
import { SearchStudentsController } from "@/features/class-creation/components/SearchStudents/controllers/SearchStudentsController.tsx";
import {
  type SearchStudentsFormSchema,
  searchStudentsSchema,
} from "@/features/class-creation/components/SearchStudents/models/search-students.models";
import type { SearchStudentsProps } from "@/features/class-creation/components/SearchStudents/types/search-students.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

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

  const commonProps = {
    pageId,
    formId,
    localForm,
    className,
    modalMode,
    ...props,
    form: props.form as UseFormReturn<any>,
    card: {
      card: { className },
      title: SEARCH_STUDENTS_TITLE,
      footer: {
        ...SEARCH_STUDENTS_FOOTER,
        formState: localForm.formState,
        formId,
      },
    },
  };

  return (
    <SearchStudentsWithCard {...commonProps}>
      <SearchStudentsWithCard.Title />
      <SearchStudentsWithCard.Content />
      <SearchStudentsWithCard.Footer />
    </SearchStudentsWithCard>
  );
}

const SearchStudentsWithCard = withTitledCard(SearchStudentsController);

export default SearchStudents;
