import { DiplomaCreationController } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import { diplomaCreationSchema } from "@/models/diploma-creation.models.ts";
import type { SignupInputItem } from "@/pages/Signup/types/signup.types.ts";
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

function DiplomaCreation({
  pageId = "new-diploma-creation-page-card",
  modalMode = true,
  className,
  inputControllers,
  ...props
}: Readonly<PageWithControllers<SignupInputItem>>) {
  const formId = pageId + "-form";
  const fetchHooks = useFetch();
  const form = useForm<{
    diploma: string;
    schoolYear: string;
    schoolLevel: string;
    mainSkills: string[];
  }>({
    resolver: zodResolver(diplomaCreationSchema),
    mode: "onTouched",
    defaultValues: {
      diploma: "",
      schoolYear: "",
      schoolLevel: "",
      mainSkills: [],
    },
  });

  const commonProps = useMemo(
    () => ({
      pageId,
      modalMode,
      className,
      form,
      formId,
      titleProps,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      inputControllers,
      ...props,
      fetchHooks,
    }),
    [fetchHooks.fetchParams]
  );
  return <DiplomaWithCard {...commonProps} />;
}

const DiplomaWithCard = withTitledCard(DiplomaCreationController);
export default DiplomaCreation;
