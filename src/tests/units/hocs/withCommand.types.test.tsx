import type { UUID } from "@/api/types/openapi/common.types";
import type { WithComboBoxCommandsResultProps } from "@/components/HOCs/types/with-combo-box-commands.types";
import type { WithControllerProps } from "@/components/HOCs/types/with-controller.types";
import type { WithEnrichedProps } from "@/components/HOCs/types/with-event-enriched-metadatas.types";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithCommandsBase,
  PopoverFieldWithControlledCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/exports/popover-field.exports";
import type { PopoverField } from "@/components/Popovers/PopoverField";
import type { PopoverFieldProps } from "@/components/Popovers/types/popover.types";
import type { AppModalNames } from "@/configs/app.config";
import { diplomaCreationInputControllers } from "@/features/class-creation";
import {
  diplomaCreationSchema,
  type DiplomaCreationFormState,
} from "@/features/class-creation/components/DiplomaCreation/models/diploma-creation.models";
import type {
  CommandHandlerFieldMeta,
  HandleAddNewItemParams,
} from "@/hooks/database/types/use-command-handler.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ChangeEvent, type ComponentProps, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

/**
 * This test suite verifies the TypeScript typings of the `withListMapper` HOC when applied to a base component (in this case, `PopoverFieldWithControllerAndCommandsList`).  It ensures that:
 * 1. The enriched component accepts both the original props and the additional enrichment props.
 * 2. The `items` prop is correctly preserved and typed, even when the component is used in a union type scenario.
 * 3. unknown unexpected or "funny" props are correctly rejected by TypeScript's type system.
 * 4. The component does not allow an index signature that would make all props optional.
 * 5. The `optional` function's return type is correctly merged and validated by the wrapper component.
 * 6. The component's runtime behavior aligns with the expected prop requirements, rendering correctly when given valid props and rendering `null` when required props are missing.
 * 7. The `onChange` prop is correctly typed and rejects incorrect signatures.
 * 8. Using the HOC, all props are correctly merged and validated, ensuring that the resulting component type reflects the intended prop structure without allowing extraneous fields.
 * 9. All component can still display they own props in the type system (it's mainly a concern in addition with the withController HOC)
 *
 * Note: These tests are sollely focused on TypeScript type checking and do not perform unknown runtime assertions on the component's behavior or rendering.
 */

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

let form: ReturnType<typeof useForm<DiplomaCreationFormState>> | null = null;
const itemsToIterate = diplomaCreationInputControllers.slice(0, 3);
// dummy list used for union-type test
const students: unknown[] = [];

beforeEach(async () => {
  const { result } = await renderHook(() =>
    useForm({
      resolver: zodResolver(diplomaCreationSchema),
      mode: "onTouched",
    }),
  );
  form = result.current;
});

type SimplePopover = ComponentProps<typeof PopoverField>;

type Command = ComponentProps<typeof PopoverFieldWithCommandsBase>;

type EnrichedCommand = ComponentProps<typeof PopoverFieldWithCommands>;
type ControlledEnrichedCommand = ComponentProps<
  typeof PopoverFieldWithControlledCommands
>;

type ListOfCommands = ComponentProps<
  typeof PopoverFieldWithControllerAndCommandsList
>;

// -----------------------------------------------------------------------------
// payload prototypes which mirror the HOC chain from the popover module
// -----------------------------------------------------------------------------
// 0. base PopoverField payload (no HOC applied)
const basePayload = {
  name: "foo",
  // placeholder: "enter", <- check it on the listmapper payload to ensure it's not lost in the chain
  className: "test",
  // fullWidth: true, <- check it on the controller payload to ensure it's not lost in the chain
  // multiSelection: true, <- check it on the enriched payload to ensure it's not lost in the chain
  side: "bottom",
  resetKey: 1,
  // required: true, <- check it on the command payload to ensure it's not lost in the chain
} satisfies PopoverFieldProps;

// Validate that later props exist on this payload
const _basePayloadCheck = {
  ...basePayload,
  // Checking that the pros exists so we can be sure this should exist when we call it later in the chain
  placeholder: "enter",
  fullWidth: true,
  multiSelection: true,
  required: true,
} satisfies PopoverFieldProps;

// Validate component type
const _typedBasePayloadByType: SimplePopover = basePayload;
const _typedBasePayloadByProps: SimplePopover = basePayload;

// Validate props survive merging (step 0)
const basePayloadMerged: SimplePopover = { ...basePayload };
const _typedBasePayloadMerged: SimplePopover = basePayloadMerged;

// Rejects extraneous fields
const _typedBasePayloadWithFunnyProp: SimplePopover = {
  ...basePayload,
  // @ts-expect-error : `funnyPropThatShouldNotExist` is not a valid prop for PopoverField
  funnyPropThatShouldNotExist: "hello",
};

void _typedBasePayloadByType;
void _typedBasePayloadByProps;
void _typedBasePayloadMerged;
void _typedBasePayloadWithFunnyProp;
void _basePayloadCheck;

// 1. command layer (without controller or list mapping)
const commandPayload = {
  ...basePayload,
  // check from earlier payload
  required: true,
  useButtonAddNew: true,
  creationButtonText: "Add New",
  useCommands: true,
  filter: (value: string, search: string, keywords: string[] | undefined) => {
    expect(value).toBeDefined();
    expect(search).toBeDefined();
    expect(keywords).toBeDefined();
    return 1;
  },
  onSelect: (value: unknown, meta: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(meta).toBeDefined();
  },
  // commandHeadings: [
  //   {
  //     id: "heading1" as UUID,
  //     groupTitle: "Heading 1",
  //     // `items` is an array of CommandItemType
  //     items: [{ value: "Item 1", id: "item1" as UUID }],
  //   },
  // ], <- check it on the next payload to ensure it's not lost in the chain
  onClick: (e: MouseEvent<HTMLButtonElement>) => {
    expect(e.target).toBeDefined();
  },
} satisfies Command;

// Validate that later props exist on this payload
const _commandPayloadCheck = {
  ..._basePayloadCheck,
  ...commandPayload,
  // Checking that the pros exists so we can be sure this should exist when we call it later in the chain
  commandHeadings: [
    {
      id: "heading1" as UUID,
      groupTitle: "Heading 1",
      // `items` is an array of CommandItemType
      items: [{ value: "Item 1", id: "item1" as UUID }],
    },
  ],
} satisfies WithComboBoxCommandsResultProps<Command>;

// Validate component type & prop
const _typedCommandPayloadByType: Command = commandPayload;
const _typedCommandPayloadByProps: WithComboBoxCommandsResultProps<Command> =
  commandPayload;

// Validate props survive merging (step 1)
const commandPayloadMerged = {
  ...basePayload,
  ...commandPayload,
} satisfies Command;

const _typedCommandPayloadMerged: WithComboBoxCommandsResultProps<Command> =
  commandPayloadMerged;

// Reject extraneous fields by type & props
const _typedFunnyCommandPayloadByType: Command = {
  ...commandPayload,
  // @ts-expect-error : `funnyPropThatShouldNotExist` is not a valid prop for the command component
  funnyPropThatShouldNotExist: "hello",
};
const _typedFunnyCommandPayloadByProps: WithComboBoxCommandsResultProps<Command> =
  {
    ...commandPayload,
    // @ts-expect-error : `funnyPropThatShouldNotExist` is not a valid prop for the command component
    funnyPropThatShouldNotExist: "hello",
  };

void _typedFunnyCommandPayloadByProps;
void _typedFunnyCommandPayloadByType;
void _typedCommandPayloadMerged;
void _typedCommandPayloadByProps;
void _typedCommandPayloadByType;

// 2. enriched command (wrapped with event metadata)
const enrichedCommandPayload = {
  ...commandPayload,
  // Checking from earilier payload
  multiSelection: true,
  setRef: () => {},
  // onOpenChange: (value: boolean, metadata: CommandHandlerFieldMeta) => {
  //   expect(value).toBeDefined();
  //   expect(metadata).toBeDefined();
  // },<- check it on the next payload to ensure it's not lost in the chain
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    metadata: CommandHandlerFieldMeta,
  ) => {
    expect(e).toBeDefined();
    expect(metadata).toBeDefined();
  },
  onValueChange: (value: unknown, metadata: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(metadata).toBeDefined();
  },
  onClick: (params: HandleAddNewItemParams) => {
    const { e, metadata } = params;
    expect(e?.target).toBeDefined();
    expect(metadata).toBeDefined();
  },
  // apiEndpoint: "/api/commands", <- check it on the next payload to ensure it's not lost in the chain
  dataReshapeFn: (d: unknown) => d,
  task: "apple-login" as AppModalNames,
} satisfies EnrichedCommand;

// Validate that later props exist on this payload
const _enrichedCommandPayloadCheck = {
  ..._commandPayloadCheck,
  ...enrichedCommandPayload,
  // these props will be added by the controller/lists later
  // placeholder: "enter",
  // fullWidth: true,
  // multiSelection: true,
  // required: true,
  apiEndpoint: "/api/commands",
  onOpenChange: (value: boolean, metadata: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(metadata).toBeDefined();
  },
  // control: form!.control,
  // items: itemsToIterate,
} satisfies WithEnrichedProps<EnrichedCommand>;

// Validate component type & prop

const _typedEnrichedCommandPayloadByProps: WithEnrichedProps<EnrichedCommand> =
  enrichedCommandPayload;
const _typedEnrichedCommandPayloadByType: EnrichedCommand =
  enrichedCommandPayload;

// Validate props survive merging (step 2)
const enrichedCommandPayloadMerged = {
  ...commandPayload,
  ...enrichedCommandPayload,
} satisfies EnrichedCommand;

const _typedEnrichedCommandPayloadMerged: WithEnrichedProps<EnrichedCommand> =
  enrichedCommandPayloadMerged;

// Reject extra props by type & props
const _typedFunnyEnrichedCommandPayloadByType: EnrichedCommand = {
  ...enrichedCommandPayload,
  // @ts-expect-error : `funnyPropThatShouldNotExist` is not valid here either
  funnyPropThatShouldNotExist: "hello",
};

const _typedFunnyEnrichedCommandPayloadCheckedByProps: WithEnrichedProps<EnrichedCommand> =
  {
    ...enrichedCommandPayload,
    // @ts-expect-error : `funnyPropThatShouldNotExist` is not valid here either
    funnyPropThatShouldNotExist: "hello",
  };

void _typedFunnyEnrichedCommandPayloadCheckedByProps;
void _typedFunnyEnrichedCommandPayloadByType;
void _typedEnrichedCommandPayloadMerged;
void _typedEnrichedCommandPayloadByProps;
void _typedEnrichedCommandPayloadByType;

// 3. controlled command
const controlledEnrichedPayload = {
  ...enrichedCommandPayload,
  // Checking from earilier payload
  fullWidth: true,
  // Checking from earilier payload
  apiEndpoint: "/api/commands",
  setRef: () => {},
  // Checking from earilier payload
  onOpenChange: (value: boolean, metadata: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(metadata).toBeDefined();
  },
  // defaultValue: "default", <- check it on the next payload to ensure it's not lost in the chain
  control: form!.control,
} satisfies ControlledEnrichedCommand;

const { name, ...rest } = controlledEnrichedPayload;
const { name: _name, ...restWithoutName } = enrichedCommandPayload;

// Validate that later props exist on this payload
const _controlledEnrichedPayloadCheck = {
  ..._enrichedCommandPayloadCheck,
  ...controlledEnrichedPayload,
  defaultValue: "default",
} satisfies WithControllerProps<ControlledEnrichedCommand>;

const _controlledEnrichedPayloadCheckWithoutRequiredName = {
  ...restWithoutName,
  ...rest,
  defaultValue: "default",
  // @ts-expect-error : `name` is required and should not be dropped in the chain
} satisfies WithControllerProps<ControlledEnrichedCommand>;

// Validate component type & prop
const _typedControlledEnrichedPayloadByType: ControlledEnrichedCommand =
  controlledEnrichedPayload;
const _typedControlledEnrichedPayloadByProps: WithControllerProps<ControlledEnrichedCommand> =
  controlledEnrichedPayload;

// Validate props survive merging
const controlledEnrichedPayloadMerge = {
  ...enrichedCommandPayload,
  ...controlledEnrichedPayload,
} satisfies ControlledEnrichedCommand;

const _typedControlledEnrichedPayloadMerged: WithControllerProps<ControlledEnrichedCommand> =
  controlledEnrichedPayloadMerge;

const { control, ...restControlledEnriched } = controlledEnrichedPayload;

const _controlledEnrichedPayloadWithoutControl = {
  ...restControlledEnriched,
  // @ts-expect-error : `control` is required and should not be dropped in the chain
} satisfies WithControllerProps<ControlledEnrichedCommand>;

// Reject extra props by type & props
const _typedFunnyControlledEnrichedPayloadByType: ControlledEnrichedCommand = {
  ...controlledEnrichedPayload,
  // @ts-expect-error : does not accept this extra field
  funnyPropThatShouldNotExist: "hello",
};
const _typedFunnyControlledEnrichedPayloadByProps: WithControllerProps<ControlledEnrichedCommand> =
  {
    ...controlledEnrichedPayload,
    // @ts-expect-error : still not allowed here
    funnyPropThatShouldNotExist: "hello",
  };

void _typedFunnyControlledEnrichedPayloadByProps;
void _typedFunnyControlledEnrichedPayloadByType;
void _typedControlledEnrichedPayloadByProps;
void _typedControlledEnrichedPayloadByType;
void _typedControlledEnrichedPayloadMerged;
void _controlledEnrichedPayloadCheckWithoutRequiredName;

// 4. list‑mapped variant
const listOfCommandsPayload = {
  ...controlledEnrichedPayload,
  items: itemsToIterate,
  // optional: (item) => ({ value: [0] }),<- check it on the next payload to ensure it's not lost in the chain
} satisfies ListOfCommands;

// Validate that later props exist on this payload
const _listOfCommandsPayloadCheck = {
  ..._controlledEnrichedPayloadCheck,
  ...listOfCommandsPayload,
  optional: (_item: unknown) => ({ value: [0] }),
} satisfies WithControllerProps<ListOfCommands>;

const { name: listOfCommandsName, items, ...listRest } = listOfCommandsPayload;

const _listOfCommandsPayloadCheckWithoutItemsAndName = {
  ...listRest,
  // @ts-expect-error : `items` is required and should not be dropped in the chain
} satisfies WithControllerProps<ListOfCommands>;

// Validate props survive merging (step 4)
const listPayloadMerged = {
  ...controlledEnrichedPayload,
  ...listOfCommandsPayload,
} satisfies ListOfCommands;

const _typedListPayloadMerged: ListOfCommands = listPayloadMerged;
const _typedListPayloadByType: ListOfCommands = listOfCommandsPayload;
const _typedListPayloadByProps: ListOfCommands = listOfCommandsPayload;

// reject extras on list-mapped component
const _typedFunnyListPayloadByType: ListOfCommands = {
  ...listOfCommandsPayload,
  // @ts-expect-error : extra prop not allowed
  funnyPropThatShouldNotExist: "hello",
};
const _typedFunnyListPayloadByProps: ListOfCommands = {
  ...listOfCommandsPayload,
  // @ts-expect-error : still rejected
  funnyPropThatShouldNotExist: "hello",
};
void _typedFunnyListPayloadByProps;
void _typedFunnyListPayloadByType;
void _typedListPayloadByProps;
void _typedListPayloadMerged;
void _typedListPayloadByType;
void _listOfCommandsPayloadCheckWithoutItemsAndName;
void _listOfCommandsPayloadCheck;

// the payload used later in tests is a slight variation of the controlled
// version; keep the old name around for backwards compatibility
const legitimateControlledPayload = {
  ...basePayload,
  // type: "button",
  setRef: () => {},
  task: "apple-login" as AppModalNames,
  apiEndpoint: "/api",
  dataReshapeFn: (d: unknown) => d,
  onOpenChange: (value: boolean, metadata: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(metadata).toBeDefined();
  },
};

const myFunnyPropThatShouldNotExist = "hello";

const _funnyControllerPayloadUltraStrict = {
  ...controlledEnrichedPayload,
  type: "button",
  myFunnyPropThatShouldNotExist,
};
const _funnyControllerPayloadUltraStrictCheck = {
  ..._funnyControllerPayloadUltraStrict,
} satisfies WithControllerProps<ControlledEnrichedCommand>;

void _funnyControllerPayloadUltraStrictCheck;

const { name: _controlledName, ..._controlledEnrichedPayloadWithoutName } =
  controlledEnrichedPayload;

describe("withListMapper types", () => {
  it("Chain sanity: each HOC stage accepts its expected payload", async () => {
    // This test exists primarily for compile-time validation; rendering
    // ensures runtime props are compatible as well.
    const { container: c0 } = await render(
      <PopoverFieldWithCommandsBase {...commandPayload} />,
    );
    const { container: c1 } = await render(
      <PopoverFieldWithCommands {...enrichedCommandPayload} />,
    );

    const { container: c1Strict } = await render(
      // @ts-expect-error `funnyPropThatShouldNotExist` is not allowed
      <PopoverFieldWithCommands {..._typedFunnyCommandPayloadByType} />,
    );

    const { container: c2 } = await render(
      <PopoverFieldWithControlledCommands {...controlledEnrichedPayload} />,
    );

    const { container: c2Strict } = await render(
      // @ts-expect-error `funnyPropThatShouldNotExist` is not allowed
      <PopoverFieldWithControlledCommands
        {..._typedFunnyEnrichedCommandPayloadByType}
      />,
    );

    // render with inline-typed literal to enforce exact props
    // the moment the object is written here the excess check applies, so
    // this call will reject extra fields such as `type`.
    // (we alias it to `c3Strict` just to show the difference)
    const { container: c3Strict } = await render(
      <PopoverFieldWithControlledCommands
        {...controlledEnrichedPayload}
        // @ts-expect-error `type` is not allowed & has extra props
        type="button"
        myFunnyPropThatShouldNotExist={myFunnyPropThatShouldNotExist}
      />,
    );

    // previous examples with variables continue to compile as before
    const { container: c3 } = await render(
      <PopoverFieldWithControlledCommands {...controlledEnrichedPayload} />,
    );

    const { container: c3UltraStrict } = await render(
      // @ts-expect-error : ULTRASTRICT - missing required `control`
      <PopoverFieldWithControlledCommands
        {..._controlledEnrichedPayloadWithoutControl}
      />,
    );

    const { container: c31Strict } = await render(
      // @ts-expect-error : missing required `name`
      <PopoverFieldWithControlledCommands
        {..._controlledEnrichedPayloadWithoutName}
      />,
    );

    const { container: c4 } = await render(
      <PopoverFieldWithControllerAndCommandsList
        {...listOfCommandsPayload}
        optional={(item) => {
          expect(item.name).toBeDefined();
        }}
      />,
    );

    const { container: c4Strict } = await render(
      // @ts-expect-error : has missing required `name and/or items` and invalid payload for this component
      <PopoverFieldWithControllerAndCommandsList
        {..._listOfCommandsPayloadCheckWithoutItemsAndName}
        optional={(item) => {
          // @ts-expect-error should not be able to access item.name because `item` should be typed as `never` since the props are not valid
          expect(item.name).toBeDefined();
        }}
      />,
    );

    expect(c0).toBeDefined();
    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
    expect(c3).toBeDefined();
    expect(c4).toBeDefined();
  });

  it("Case 0 : union type should not drop items property", () => {
    type UnionList = ComponentProps<
      typeof PopoverFieldWithControllerAndCommandsList<
        typeof itemsToIterate | typeof students,
        undefined
      >
    >;
    // if the bug is present the following access will error because the
    // props type might be the sentinel object without an `items` field.
    const _check: UnionList["items"] = itemsToIterate;
  });
});
