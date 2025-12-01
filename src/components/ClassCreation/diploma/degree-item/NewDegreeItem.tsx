import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DialogClose, DialogFooter } from "@/components/ui/dialog.tsx";
import { degreeCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useDegreeCreationForm } from "@/hooks/database/classes/useDegreeCreationForm.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import {
  diplomaFieldData,
  type DegreeCreationFormSchema,
  type DegreeCreationInputItem,
} from "@/models/degree-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * Component for creating a new degree item.
 *
 * @param pageId - The ID of the page.
 * @param modalMode - Whether the component is in modal mode.
 * @param inputControllers - The input controllers for the form.
 */
export function NewDegreeItem({
  pageId = "new-degree-item",
  modalMode = true,
  inputControllers = degreeCreationInputControllers,
  className,
  ...props
}: Readonly<PageWithControllers<DegreeCreationInputItem>>) {
  const { closeDialog } = useDialog();
  const { setRef, observedRefs } = useMutationObserver({});
  const { onSubmit, data, error, isLoading, isLoaded } =
    useDegreeCreationForm("LEVEL");
  const form = useForm<DegreeCreationFormSchema>({
    resolver: zodResolver(diplomaFieldData),
    mode: "onTouched",
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    if (isLoading) return;
    onSubmit(variables);
  };

  useEffect(() => {
    if (isLoaded && !error) {
      form.reset();
    }

    if (data) {
      closeDialog(null, "new-degree-item-dialog");
    }
  }, [isLoaded, error, data, form]);

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;
  const formId = pageId + "-form";
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
        title="Création d'un nouveau domaine / métier"
        description="Ajoutez un nouveau domaine / métier pour les diplômes."
      />
      <CardContent>
        <form
          id={formId}
          className="grid gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <ControlledInputList
            items={inputControllers}
            form={form}
            setRef={setRef}
            observedRefs={observedRefs}
          />
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
          form={formId}
          disabled={!form.formState.isValid}
        >
          Sauvegarder
        </Button>
      </DialogFooter>
    </Card>
  );
}
