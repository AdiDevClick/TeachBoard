import type { DegreeModuleProps } from "@/components/ClassCreation/diploma/degree-module/types/degree-module.types";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { PopoverFieldWithCommands } from "@/components/Popovers/PopoverField.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { degreeModuleCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Controller component for creating a new degree skill.
 *
 * !! IMPORTANT !! Be sure that the inputControllers passed to this component are already validated by Zod Schema.
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param form - The react-hook-form instance.
 * @param className - Additional CSS classes for styling.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 */
export function DegreeModuleController({
  pageId = "new-degree-module",
  inputControllers = degreeModuleCreationInputControllers,
  className = "grid gap-4",
  formId,
  form,
  fetchHooks,
}: Readonly<DegreeModuleProps>) {
  const {
    setRef,
    observedRefs,
    fetchParams,
    data,
    newItemCallback,
    openingCallback,
    submitCallback,
  } = useCommandHandler({
    fetchHooks,
    form,
    pageId,
  });

  const queryClient = useQueryClient();

  const resultsCallback = useCallback((keys: unknown[]) => {
    const cachedData = queryClient.getQueryData(keys ?? []);
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Cached data for ", keys, " is ", cachedData);
    }
    if (cachedData === undefined) {
      return data;
    }
    return cachedData;
  }, []);

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_SKILL.endPoints.MODULE,
      API_ENDPOINTS.POST.CREATE_SKILL.dataReshape
    );
  };

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, FETCH data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    openingCallback(open, metaData, inputControllers);
  };

  const handleCommandSelection = (value: string) => {
    if (currentSkills.has(value)) {
      currentSkills.delete(value);
    } else {
      currentSkills.add(value);
    }
    form.setValue("skillList", Array.from(currentSkills), {
      shouldValidate: true,
    });
  };

  // Get the current skills from the form
  const currentSkills = new Set(form.watch("skillList") || []);

  const id = formId ?? pageId + "-form";

  return (
    <form
      id={id}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={inputControllers.slice(0, 2)}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
      />
      <ControlledDynamicTagList
        form={form}
        setRef={setRef}
        {...inputControllers[2]}
        observedRefs={observedRefs}
        itemList={Array.from(currentSkills)}
      />
      <PopoverFieldWithCommands
        multiSelection
        setRef={setRef}
        onSelect={handleCommandSelection}
        onOpenChange={handleOpening}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
        {...inputControllers[2]}
      />
    </form>
  );
}
{
  /* <form id={id} className={className} onSubmit={form.handleSubmit(handleSubmit)}>
  <ControlledInputList
    items={inputControllers}
    form={form}
    setRef={setRef}
    observedRefs={observedRefs}
  />
  {/* Display current skills */
}
// <Field>
//   <ItemGroup id={`${pageId}-skills`} className="grid gap-2">
//     <ItemTitle>Compétences sélectionnées</ItemTitle>
//     {currentSkills.length > 0 ? (
//       <Item variant={"default"} className="p-0">
//         <ItemContent className="flex-row flex-wrap gap-2">
//           <ListMapper items={currentSkills}>
//             {(rawItem: string | { item: string; id?: string }) => {
//               const item =
//                 typeof rawItem === "string" ? rawItem : rawItem.item;

//               const handleRemoveSkill = () => {
//                 const updatedSkills = currentSkills.filter(
//                   (skill: string) => skill !== item
//                 );
//                 form.setValue("skills", updatedSkills, {
//                   shouldValidate: true,
//                 });
//               };

//               return (
//                 <ItemActions key={id} className="relative">
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button id={id} size="sm" variant="outline">
//                         {item}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent
//                       side="top"
//                       align="center"
//                       sideOffset={8}
//                       className="p-0.5 w-auto max-h-min-content"
//                     >
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={handleRemoveSkill}
//                         id={id + "-delete"}
//                         aria-label={`Supprimer ${item}`}
//                       >
//                         Supprimer
//                       </Button>
//                       <PopoverArrow className="fill-popover" />
//                     </PopoverContent>
//                   </Popover>
//                 </ItemActions>
//               );
//             }}
//           </ListMapper>
//         </ItemContent>
//       </Item>
//     ) : (
//       <p className="text-sm text-muted-foreground">
//         Aucune compétence sélectionnée
//       </p>
//     )}
//   </ItemGroup>
//   <FieldError errors={[form.formState.errors.skills]} />
// </Field>
// {/* Skill selection popover */}
// <PopoverFieldWithCommands
//   label={inputControllers[2].title}
//   form={form}
//   setRef={setRef}
//   onSelect={(value: string) => {
//     console.log("Selected Value in command : ", value);
//     // Add the selected skill to the array if not already present
//     if (value && !currentSkills.includes(value)) {
//       const updatedSkills = [...currentSkills, value];
//       form.setValue("skills", updatedSkills, { shouldValidate: true });
//     }
//   }}
//   onOpenChange={handleOpening}
//   observedRefs={observedRefs}
//   onAddNewItem={handleAddNewItem}
//   commandHeadings={resultsCallback([fetchParams.contentId, fetchParams.url])}
//   {...inputControllers[2]}
// />
//</form>; */}
