import type {
  ClassCreationFormSchema,
  ClassCreationInputItem,
} from "@/components/ClassCreation/types/class-creation.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import {
  VerticalFieldSelectWithController,
  VerticalFieldSelectWithControllerAndCommandsList,
} from "@/components/Selects/VerticalFieldSelect.tsx";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DialogClose, DialogFooter } from "@/components/ui/dialog.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE } from "@/configs/app.config.ts";
import { classCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useClassCreation } from "@/hooks/database/classes/useClassCreation.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { classCreationSchema } from "@/models/class-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type PointerEvent } from "react";
import { useForm } from "react-hook-form";

const year = new Date().getFullYear();
const years = yearsListRange(year, 5);
const defaultSchoolYear = year + " - " + (year + 1);

/**
 * Generates a list of school years within a specified range.
 *
 * @param year - The central year to base the range on.
 * @param range - The number of years to include before and after the central year.
 * @returns An array of objects containing the school year names and IDs.
 */
function yearsListRange(
  year: number,
  range: number
): { name: string; id: string }[] {
  const startYear = year - range;
  const endYear = year + range;
  const length = endYear - startYear + 1;
  return Array.from({ length }, (_v, i) => {
    const yearLabel = `${startYear + i} - ${startYear + i + 1}`;
    return {
      name: yearLabel,
      id: yearLabel,
    };
  });
}

const inputs = [
  {
    // Required for WithController to be able to process the field
    name: "degreeConfigId",
    label: "Année et niveau du diplôme",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter un diplôme",
    task: "add-diploma",
    useCommands: true,
    fullWidth: true,
    useButtonAddNew: true,
  },
  {
    // Required for WithController to be able to process the field
    // The "students" field can hold an array of selected student ids (or similar)
    name: "students",
    label: "Elèves",
    task: "add-students",
    placeholder: "Sélectionnez...",
    creationButtonText: "Ajouter des élèves",
    useCommands: false,
    fullWidth: true,
    useButtonAddNew: true,
  },
  {
    name: "schoolYear",
    label: "Année scolaire",
    task: "add-school-year",
    placeholder: defaultSchoolYear,
    defaultValue: defaultSchoolYear,
    creationButtonText: false,
    useCommands: false,
    fullWidth: false,
    useButtonAddNew: false,
  },
];

export function ClassCreation({
  modalMode = false,
  inputControllers = classCreationInputControllers,
  ref,
  pageId = "class-creation-page-card",
  className,
  ...props
}: Readonly<PageWithControllers<ClassCreationInputItem>>) {
  const { openDialog } = useDialog();
  const { data, error, isLoading, onSubmit } = useClassCreation();
  // const { data, error, isLoading, onSubmit } = useClassNames();
  const {
    data: diplomasData,
    error: diplomasError,
    isLoading: isDiplomasLoading,
    isLoaded: isDiplomasLoaded,
    onSubmit: getDiplomas,
  } = useFetch(API_ENDPOINTS.GET.DIPLOMAS, "diplomas");
  // const { data, error, isLoading, onSubmit } = useStudents();
  const { setRef, observedRefs } = useMutationObserver({});
  const [selected, setSelected] = useState(false);
  const [isYearOpened, setIsYearOpened] = useState(false);

  const form = useForm<ClassCreationFormSchema>({
    resolver: zodResolver(classCreationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      schoolYear: defaultSchoolYear,
    },
  });

  const handleNewDiploma = async (e: PointerEvent<HTMLDivElement>) => {
    openDialog(e, "create-diploma");
    // setSelected(true);
    // await wait(150);
    // setSelected(false);
  };

  useEffect(() => {
    if (diplomasData || diplomasError) {
      if (DEV_MODE) {
        console.debug("useFetch diplomasData", diplomasData ?? diplomasError);
      }
      // You can handle additional side effects here if needed
    }
  }, [diplomasData, diplomasError, isDiplomasLoading]);

  useEffect(() => {
    if (!pageId || observedRefs.size === 0) return;
    const observed = observedRefs.get(pageId + "-schoolYear");
    console.log("Observed for schoolYear:", observed);
    if (observed) {
      console.log(
        observed.element.dataset.inputcontrollername === "degreeConfigId"
      );
      form.setFocus("schoolYear");
    }
  }, [observedRefs]);

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;

  return (
    <Card id={pageId} ref={ref} className={className} {...props}>
      <Title
        className="text-left!"
        style={{
          paddingInline: `calc(var(--spacing) * 6)`,
        }}
        title="Créer une classe"
        description="Ajoutez une nouvelle classe pour commencer à gérer vos élèves et leurs évaluations."
      />
      <CardContent>
        <form
          ref={setRef}
          id={`${pageId}-form`}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <ControlledInputList
            items={inputControllers}
            form={form}
            ref={setRef}
          />
          <VerticalFieldSelectWithControllerAndCommandsList
            items={inputs}
            form={form}
            // id={`${pageId}-year`}
            setRef={setRef}
            onLoad={(e) => {
              console.log(e);
              setIsYearOpened(true);
            }}
            onOpenChange={(value) => {
              if (value && !isDiplomasLoaded) getDiplomas();
            }}
            onAddNewItem={handleNewDiploma}
          >
            {isYearOpened && (
              <ListMapper items={years}>
                <NonLabelledGroupItem />
              </ListMapper>
            )}
          </VerticalFieldSelectWithControllerAndCommandsList>
          <VerticalFieldSelectWithController
            setRef={setRef}
            name="schoolYear"
            form={form}
            fullWidth={false}
            placeholder={defaultSchoolYear}
            defaultValue={defaultSchoolYear}
            label="Année scolaire"
            id={`${pageId}-schoolYear`}
          >
            <ListMapper items={years}>
              <NonLabelledGroupItem />
            </ListMapper>
          </VerticalFieldSelectWithController>
          {/* {data?.data?.classes.length > 0 && (
            <>
              <SelectSeparator />
              <ListMapper items={data.data.classes}>
                <LabelledGroup ischild>
                  <NonLabelledGroupItem />
                </LabelledGroup>
              </ListMapper>
            </>
          )}
          {/* </VerticalFieldSelect> */}

          {/* School Year Select */}
        </form>
      </CardContent>
      {/* <CardFooter>
      {/* Card footer intentionally left empty */}
      <DialogFooter>
        <DialogClose asChild className="justify-end">
          <Button variant="outline">Annuler</Button>
        </DialogClose>
        {/* <DialogClose asChild className="justify-end mr-6"> */}
        <Button
          variant="outline"
          className="justify-end mr-6"
          type="submit"
          disabled={!form.formState.isValid}
          // className="w-full"
          // disabled={isLoading}
          // onClick={onSubmit}
        >
          Créer la classe
        </Button>
        {/* </DialogClose> */}
      </DialogFooter>
    </Card>
  );
}
