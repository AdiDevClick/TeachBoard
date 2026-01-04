import { DegreeModuleController } from "@/components/ClassCreation/diploma/degree-module/controller/DegreeModuleController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { degreeModuleCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import {
  degreeModuleData,
  type DegreeModuleFormSchema,
  type DegreeModuleInputItem,
} from "@/models/degree-module.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Création de nouveaux modules de compétences",
  description: "Ces modules pourront être associés aux diplômes.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

/**
 * View component for creating a new degree skill.
 *
 * @description This inits Zod validated form
 *
 * @param pageId - The ID of the page.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param modalMode - Whether the component is in modal mode.
 * @param props - Additional props.
 */
function DegreeModule({
  pageId = "new-degree-module",
  modalMode = true,
  inputControllers = degreeModuleCreationInputControllers,
  ...props
}: Readonly<PageWithControllers<DegreeModuleInputItem>>) {
  const form = useForm<DegreeModuleFormSchema>({
    resolver: zodResolver(degreeModuleData),
    mode: "onTouched",
    defaultValues: {
      name: "",
      code: "",
      skillList: [],
    },
  });

  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      modalMode,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      titleProps,
      ...props,
      form,
    }),
    [form.formState, props]
  );

  return <DegreeModuleWithCard {...commonProps} />;
}

const DegreeModuleWithCard = withTitledCard(DegreeModuleController);

export default DegreeModule;
