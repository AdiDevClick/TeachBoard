import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  DEGREE_MODULE_CARD_TITLE,
  DEGREE_MODULE_FOOTER_PROPS,
} from "@/features/class-creation/components/DegreeModule/config/degree-module.configs";
import { DegreeModuleController } from "@/features/class-creation/components/DegreeModule/controllers/DegreeModuleController.tsx";
import { degreeModuleCreationInputControllers } from "@/features/class-creation/components/DegreeModule/forms/degree-module-inputs";
import {
  degreeModuleData,
  type DegreeModuleFormSchema,
  type DegreeModuleInputItem,
} from "@/features/class-creation/components/DegreeModule/models/degree-module.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  className = "grid gap-4",
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

  const commonProps = {
    pageId,
    inputControllers,
    formId,
    className,
    modalMode,
    card: {
      card: { className },
      title: DEGREE_MODULE_CARD_TITLE,
      footer: {
        ...DEGREE_MODULE_FOOTER_PROPS,
        formState: form.formState,
        formId,
      },
    },
    ...props,
    form,
  };

  return (
    <DegreeModuleWithCard {...commonProps}>
      <DegreeModuleWithCard.Title />
      <DegreeModuleWithCard.Content />
      <DegreeModuleWithCard.Footer />
    </DegreeModuleWithCard>
  );
}

const DegreeModuleWithCard = withTitledCard(DegreeModuleController);

export default DegreeModule;
