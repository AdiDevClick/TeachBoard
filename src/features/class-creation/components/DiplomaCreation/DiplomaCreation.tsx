import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  DIPLOMA_CREATION_CARD_FOOTER_PROPS,
  DIPLOMA_CREATION_CARD_TITLE,
} from "@/features/class-creation/components/DiplomaCreation/config/diploma-creation.configs";
import { DiplomaCreationController } from "@/features/class-creation/components/DiplomaCreation/controllers/DiplomaCreationController.tsx";
import {
  diplomaCreationSchema,
  type DiplomaCreationFormState,
  type DiplomaInputItem,
} from "@/features/class-creation/components/DiplomaCreation/models/diploma-creation.models";
import { diplomaCreationInputControllers } from "@/features/class-creation/index.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

/**
 *
 * @param pageId - The ID of the page.
 * @param modalMode - Whether the creation is in a modal or a full page.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 */
function DiplomaCreation({
  pageId = "create-diploma",
  modalMode = true,
  className = "grid gap-4",
  inputControllers = diplomaCreationInputControllers,
  ...props
}: Readonly<PageWithControllers<DiplomaInputItem>>) {
  const form = useForm<DiplomaCreationFormState>({
    resolver: zodResolver(diplomaCreationSchema),
    mode: "onTouched",
    defaultValues: {
      diplomaFieldId: "",
      yearId: "",
      levelId: "",
      modulesList: [],
      modulesListDetails: [],
    },
  });

  const formId = pageId + "-form";

  const commonProps = {
    pageId,
    modalMode,
    formId,
    className,
    card: {
      card: { className },
      title: DIPLOMA_CREATION_CARD_TITLE,
      footer: {
        ...DIPLOMA_CREATION_CARD_FOOTER_PROPS,
        formState: form.formState,
        formId,
      },
    },
    inputControllers,
    ...props,
    form,
  };

  return (
    <DiplomaWithCard {...commonProps}>
      <DiplomaWithCard.Title />
      <DiplomaWithCard.Content />
      <DiplomaWithCard.Footer />
    </DiplomaWithCard>
  );
}

const DiplomaWithCard = withTitledCard(DiplomaCreationController);
export default DiplomaCreation;
