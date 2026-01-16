import { DiplomaCreationController } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { diplomaCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import {
  diplomaCreationSchema,
  type DiplomaCreationFormSchema,
  type DiplomaInputItem,
} from "@/models/diploma-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Création de diplômes ou certifications",
  description:
    "Ajoutez des compétences en lien avec la certification et l'année scolaire pour vos élèves.",
};

const footerProps = {
  submitText: "Créer le diplôme",
};

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
  const form = useForm<DiplomaCreationFormSchema>({
    resolver: zodResolver(diplomaCreationSchema),
    mode: "onTouched",
    defaultValues: {
      diplomaFieldId: "",
      yearId: "",
      levelId: "",
      modulesList: [],
    },
  });

  const formId = pageId + "-form";

  const commonProps = useMemo(() => {
    return {
      pageId,
      modalMode,
      formId,
      className,
      titleProps,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      inputControllers,
      ...props,
      form,
    };
  }, [form.formState, props]);
  return <DiplomaWithCard {...commonProps} />;
}

const DiplomaWithCard = withTitledCard(DiplomaCreationController);
export default DiplomaCreation;
