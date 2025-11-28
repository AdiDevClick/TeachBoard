import { VerticalFieldSelectWithControllerAndCommandsList } from "@/components/Selects/VerticalFieldSelect.tsx";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DialogClose, DialogFooter } from "@/components/ui/dialog.tsx";
import { diplomaCreationSchema } from "@/models/diploma-creation.models.ts";
import type { SignupInputItem } from "@/pages/Signup/types/signup.types.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

type DiplomaCreationInputs = {
  task: string;
  name: string;
  label: string;
  placeholder: string;
  creationButtonText: string;
  useCommands: boolean;
  apiEndpoint: string;
};

const inputs: DiplomaCreationInputs[] = [
  {
    task: "add-diploma-field",
    name: "diplomaField",
    label: "Métier / Domaine du diplôme",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un métier ou domaine",
    useCommands: true,
    apiEndpoint: "/field",
  },
  {
    task: "add-school-year",
    name: "schoolYear",
    label: "Année scolaire",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter une année scolaire",
    useCommands: true,
    apiEndpoint: "/year",
  },
  {
    task: "add-school-level",
    name: "schoolLevel",
    label: "Diplôme / Niveau scolaire",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un niveau scolaire",
    useCommands: true,
    apiEndpoint: "/level",
  },
];

export function DiplomaCreation({
  pageId = "diploma-creation-page-card",
  modalMode = true,
  className,
  inputControllers,
  ...props
}: Readonly<PageWithControllers<SignupInputItem>>) {
  const [selected, setSelected] = useState(false);

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
  const handleChange = (open: boolean) => {
    console.log(open);
    if (open && !selected) {
      // setSelected(true);
    }
  };

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;

  return (
    <Card
      id={pageId}
      {...props}
      className={className}
      style={{ justifySelf: "center" }}
    >
      <Title
        className="text-left!"
        style={{
          paddingInline: `calc(var(--spacing) * 6)`,
        }}
        title="Création de diplômes ou certifications"
        description="Ajoutez des compétences en lien avec la certification et l'année scolaire pour vos élèves."
      />
      <CardContent>
        <form
          id={pageId + "-form"}
          className="grid gap-4"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <VerticalFieldSelectWithControllerAndCommandsList
            items={inputs}
            form={form}
            onOpenChange={handleChange}
          />
          {/* <ListMapper items={inputs}>
            <VerticalFieldSelectWithControlledCommands
              form={form}
              onOpenChange={handleChange}
            />
          </ListMapper> */}
        </form>
      </CardContent>
      <DialogFooter>
        <DialogClose asChild className="justify-end">
          <Button variant="outline">Annuler</Button>
        </DialogClose>
        <Button
          variant="outline"
          className="justify-end mr-6"
          type="submit"
          disabled={!form.formState.isValid}
        >
          Créer le diplôme
        </Button>
      </DialogFooter>
    </Card>
  );
}
