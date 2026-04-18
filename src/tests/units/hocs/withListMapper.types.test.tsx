import type { UUID } from "@/api/types/openapi/common.types";
import withListMapper from "@/components/HOCs/withListMapper";
import {
  PopoverFieldWithControllerAndCommandsList,
  type PopoverFieldWithControlledCommands,
} from "@/components/Popovers/exports/popover-field.exports";
import { EvaluationSliderList } from "@/components/Sliders/exports/sliders.exports";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types";
import { DynamicTag } from "@/components/Tags/DynamicTag";
import type {
  DynamicTagsProps,
  DynamicTagsState,
} from "@/components/Tags/types/tags.types";
import type { AppModalNames } from "@/configs/app.config";
import { diplomaCreationInputControllers } from "@/features/class-creation/components/DiplomaCreation/forms/diploma-creation-inputs";
import {
  diplomaCreationSchema,
  type DiplomaCreationFormState,
} from "@/features/class-creation/components/DiplomaCreation/models/diploma-creation.models";
import type { StudentWithPresence } from "@/features/evaluations/create/store/types/steps-creation-store.types";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import type {
  HasStringIndex,
  IsAssignable,
  ShouldReject,
} from "@/utils/types/types.utils";
import { UniqueSet } from "@/utils/UniqueSet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ChangeEvent, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

/**
 * !! IMPORTANT INFORMATION !!
 *
 * NEVER EVER MODIFY THIS FILE TO FIX A TYPING ISSUE IN THE COMPONENTS. If you have a typing issue, you should fix it in the component itself and then add a test case here to ensure the issue is fixed and doesn't regress.
 *
 * THIS FILE IS THE TRUTH SOURCE FOR THE COMPONENTS' TYPES. If it's green, the types are correct. If it's red, there is a typing issue that needs to be fixed in the component code, not here.
 *
 * If you feel the need to bypass the type system in this file, then you are doing it wrong. Please modify the component's types instead
 */

/**
 * This test suite verifies the TypeScript typings of the `withListMapper` HOC when applied to a base component (in this case, `PopoverFieldWithControllerAndCommandsList`).  It ensures that:
 * 1. The enriched component accepts both the original props and the additional enrichment props.
 * 2. The `items` prop is correctly preserved and typed, even when the component is used in a union type scenario.
 * 3. Any unexpected or "funny" props are correctly rejected by TypeScript's type system.
 * 4. The component does not allow an index signature that would make all props optional.
 * 5. The `optional` function's return type is correctly merged and validated by the wrapper component.
 * 6. The component's runtime behavior aligns with the expected prop requirements, rendering correctly when given valid props and rendering `null` when required props are missing.
 * 7. The `onChange` prop is correctly typed and rejects incorrect signatures.
 * 8. Using the HOC, all props are correctly merged and validated, ensuring that the resulting component type reflects the intended prop structure without allowing extraneous fields.
 * 9. All component can still display they own props in the type system (it's mainly a concern in addition with the withController HOC)
 *
 * Note: These tests are sollely focused on TypeScript type checking and do not perform any runtime assertions on the component's behavior or rendering.
 */

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

let form = {} as ReturnType<typeof useForm<DiplomaCreationFormState>>;
const itemsToIterate = diplomaCreationInputControllers.slice(0, 3);

beforeEach(async () => {
  const { result } = await renderHook(() =>
    useForm({
      resolver: zodResolver(diplomaCreationSchema),
      mode: "onTouched",
    }),
  );
  form = result.current;
});

type ListProps = ComponentProps<
  typeof PopoverFieldWithControllerAndCommandsList
>;

type ControlledProps = ComponentProps<
  typeof PopoverFieldWithControlledCommands
>;

type ListItemPayload = ListProps["items"] extends readonly (infer TItem)[]
  ? TItem
  : ListProps["items"] extends Record<string, infer TValue>
    ? TValue
    : never;

type ChildPayloadContract = (typeof itemsToIterate)[number];

// minimal student object matching StudentWithPresence
const sampleStudent: StudentWithPresence = {
  id: "00000000-0000-0000-0000-000000000000" as UUID,
  fullName: "John Doe",
  isPresent: true,
  overallScore: null,
  assignedTask: null,
  evaluations: null,
};

// generate a small list with differing UUIDs
const students: StudentWithPresence[] = [];
for (let i = 0; i < 5; i++) {
  const idx = String(i + 1).padStart(2, "0");
  const newId = (sampleStudent.id.slice(0, -2) + idx) as UUID;
  students.push({
    ...sampleStudent,
    id: newId,
  });
}

const basePayload = {
  name: "foo",
  title: "title",
  placeholder: "enter",
  className: "test",
};

const legitimateControlledPayload = {
  ...basePayload,
  // type: "button",
  setRef: () => {},
  task: "apple-login" as AppModalNames,
  apiEndpoint: "/api",
  dataReshapeFn: (d: unknown) => d,
  onOpenChange: (value: boolean, meta: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(meta).toBeDefined();
  },
};

const myFunnyPropThatShouldNotExist = "hello";

const funnyControllerPayload = {
  ...legitimateControlledPayload,
  type: "button",
  myFunnyPropThatShouldNotExist,
};

const validItemPayload: ChildPayloadContract = itemsToIterate[0];

const invalidItemPayload = {
  ...legitimateControlledPayload,
  type: "button",
  myFunnyPropThatShouldNotExist,
};

// Validated one that exists for the ControlledLabelledInput
// (not used at runtime, prefix with underscore to silence unused warnings)
const _typedLegitimateControlledPayload: Omit<ControlledProps, "control"> = {
  ...basePayload,
  ...itemsToIterate[0],
  setRef: () => {},
  onOpenChange: (value: boolean, meta: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(meta).toBeDefined();
  },
};
void _typedLegitimateControlledPayload;
// attempting to build a payload that completely omits the required
// `items` prop should fail at compile time. we *do not* rewrite the type
// with Omit here – using the full `ListProps` forces Typescript to catch the
// missing field.
// @ts-expect-error missing the mandatory `items` prop
const typedMissingItemsShouldError: ListProps = {
  ...basePayload,
  control: form!.control,
  setRef: () => {},
  onOpenChange: (value: boolean, meta: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(meta).toBeDefined();
  },
};

// attempting to build a payload that omits the `items` prop entirely
const typedWithoutName = {
  title: "title",
  placeholder: "enter",
  className: "test",
  // items: itemsToIterate,
  control: form!.control,
  setRef: () => {},
  onOpenChange: (value: boolean, meta: CommandHandlerFieldMeta) => {
    expect(value).toBeDefined();
    expect(meta).toBeDefined();
  },
  // @ts-expect-error missing the required `items` property
} satisfies ListProps;

// @ts-expect-error missing the required `items` property
const _typedWithoutName: ListProps = typedWithoutName;
void _typedWithoutName;

// also show incorrect onChange typing
const typedFunnyPayload = {
  ...legitimateControlledPayload,
  // @ts-expect-error wrong signature
  onChange: ({
    e,
    meta,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    meta: CommandHandlerFieldMeta;
  }) => {
    expect(e.target).toBeInvalid();
    expect(meta).toBeUndefined();
  },
} satisfies Omit<ListProps, "control" | "items" | "optional">;
void typedFunnyPayload;

describe("withListMapper types", () => {
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
    expect(_check).toBeDefined();
  });

  it("Case 1 : accepts legitimate payload and merges both objects", async () => {
    // render to ensure runtime compatibility when props are split across two
    // objects (a very common pattern when combining stored payload with
    // runtime values).
    const runtimePayload = {
      ...legitimateControlledPayload,
      // setRef: () => {},
      // // observedRefs: [],
      control: form?.control,
      // onSelect: () => {},
      // onOpenChange: () => {},
      // onClick: () => {},
      // // commandHeadings: () => {},
      items: itemsToIterate,
      // id: "add-module-skills",
      // apiEndpoint: API_ENDPOINTS.GET.SKILLS.endPoints.MODULES,
      // dataReshapeFn: API_ENDPOINTS.GET.SKILLS.dataReshape,
      // task: "new-degree-module" as AppModalNames,
      // name: "modulesList",
      // // type: "button", <- !! IMPORTANT !! Makes the rejection. Do not use "type"
      // title: "Modules",
      // optional: (item) => ({ value: item.title }),
      // useButtonAddNew: true,
      // creationButtonText: "Ajouter un module",
      // useCommands: true,
      // placeholder: "Recherchez des modules...",
    } satisfies ListProps;

    const isAssignable: IsAssignable<typeof runtimePayload, ListProps> = true;

    const { container } = await render(
      <PopoverFieldWithControllerAndCommandsList {...runtimePayload} />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(isAssignable).toBe(true);
  });

  // This test shows that spread with extra props doesn't cause an error at the call site - please be aware of this when you use the HOC - Try to type/satisfies your payloads before you spread them to ensure you catch any extra props that might be rejected by the component - Required props missing will still be caught even with the spread - Future fix might come soon
  it("Case 1.2 : rejects non legitimate payload", async () => {
    const falseRuntimePayload = {
      ...funnyControllerPayload,
      control: form?.control,
      items: itemsToIterate,
    };

    const falseRuntimePayloadRejected: ShouldReject<
      typeof falseRuntimePayload,
      ListProps
    > = true;

    const validItemAssignable: IsAssignable<
      typeof validItemPayload,
      ChildPayloadContract
    > = true;

    const invalidItemRejected: ShouldReject<
      typeof invalidItemPayload,
      ChildPayloadContract
    > = true;

    const { container: badContainer } = await render(
      // @ts-expect-error extra props should be rejected by the component type
      <PopoverFieldWithControllerAndCommandsList {...falseRuntimePayload} />,
    );

    expect(badContainer.firstChild).not.toBeNull();
    expect(falseRuntimePayloadRejected).toBe(true);
    expect(validItemAssignable).toBe(true);
    expect(invalidItemRejected).toBe(true);
  });

  it("Case 2 : rejects extra props", async () => {
    const isAssignable: IsAssignable<typeof funnyControllerPayload, ListProps> =
      false;
    const assertReject: ShouldReject<typeof funnyControllerPayload, ListProps> =
      true;

    const invalidItemRejected: ShouldReject<
      typeof invalidItemPayload,
      ChildPayloadContract
    > = true;

    const validItemAssignable: IsAssignable<
      typeof validItemPayload,
      ChildPayloadContract
    > = true;

    const rejectItemPayload: ShouldReject<
      typeof funnyControllerPayload,
      ListItemPayload
    > = true;

    // we still perform a simple valid render to keep the test runner happy
    const runtimePayload = {
      control: form?.control,
    };

    const { container } = await render(
      <PopoverFieldWithControllerAndCommandsList
        items={itemsToIterate}
        {...runtimePayload}
      />,
    );

    const { container: badContainer } = await render(
      // compile-time check: passing an item that contains an unexpected field
      // should no longer compile. the line below is intentionally erroneous.
      <PopoverFieldWithControllerAndCommandsList
        items={[
          {
            ...legitimateControlledPayload,
            // @ts-expect-error extra props that isn't allowed should be rejected
            type: "button",
            myFunnyPropThatShouldNotExist,
          },
        ]}
        {...runtimePayload}
      />,
    );

    expect(container).toBeDefined();
    expect(badContainer).toBeDefined();
    expect(isAssignable).toBe(false);
    expect(assertReject).toBe(true);
    expect(invalidItemRejected).toBe(true);
    expect(validItemAssignable).toBe(true);
    expect(rejectItemPayload).toBe(true);
  });

  it("Case 3 : index signature observation", async () => {
    const hasIndex: HasStringIndex<ListProps> = false;
    expect(hasIndex).toBe(false);

    // also try rendering simple payload to ensure no issue
    const runtimePayload = {
      control: form?.control,
    };

    const { container } = await render(
      <PopoverFieldWithControllerAndCommandsList
        items={itemsToIterate}
        {...runtimePayload}
      />,
    );
    expect(container).toBeDefined();
  });

  it("Case 4 : ListMapper should understand the return of optional function and correctly type and merge it so the wrapper component validates the props", async () => {
    const handleValueChange = (
      newValue: number[],
      student?: EvaluationSliderProps,
    ) => {
      expect(newValue).toBeDefined();
      expect(student).toBeUndefined();
    };

    const { container } = await render(
      <EvaluationSliderList
        items={students}
        optional={(student) => {
          // value must be number[] to match EvaluationSliderProps at runtime
          return {
            value: [student.id.length % 100],
          };
        }}
        onValueChange={handleValueChange}
      />,
    );
    expect(container).toBeDefined();
  });

  it("Case 4.5 : ListMapper should inject index automatically and not require it on the wrapped component", async () => {
    function Dummy({
      id,
      index,
      value,
    }: Readonly<{
      id: string;
      index: number;
      value: number;
    }>) {
      return (
        <div>
          {id}-{index}-{value}
        </div>
      );
    }

    const DummyList = withListMapper(Dummy);

    const { container } = await render(
      <DummyList
        items={[{ id: "item-1" }]}
        optional={(item) => ({ value: item.id.length })}
      />,
    );

    expect(container).toBeDefined();
  });

  it("Case 5 : ListMapper without control props should reject", async () => {
    const { container } = await render(
      // @ts-expect-error missing required `control` prop should be rejected by the component type
      <PopoverFieldWithControllerAndCommandsList
        items={itemsToIterate}
        {...legitimateControlledPayload}
      />,
    );

    expect(container).toBeDefined();
  });

  it("Case 5.5 : ListMapper without items props should reject", async () => {
    const { container } = await render(
      // @ts-expect-error missing required `items` prop should be rejected by the component type
      <PopoverFieldWithControllerAndCommandsList
        {...legitimateControlledPayload}
      />,
    );

    expect(container).toBeDefined();
  });

  it("Case 6 : ListMapper should reject a non complete optional function return value", async () => {
    const handleValueChange = (
      newValue: number[],
      student?: EvaluationSliderProps,
    ) => {
      expect(newValue).toBeDefined();
      expect(student).toBeUndefined();
    };

    const { container } = await render(
      // @ts-expect-error the optional function is missing the required `value` field in its return type
      <EvaluationSliderList
        items={students}
        onValueChange={handleValueChange}
      />,
    );
    expect(container).toBeDefined();
  });

  it("Case 7 : ListMapper should not reject a tuple access from optional", async () => {
    const { result: stateResult } = await renderHook(() =>
      useState<DynamicTagsState>(new UniqueSet()),
    );
    const [renderItems, setRenderItems] = stateResult.current;
    const props: DynamicTagsProps = {
      pageId: "test-page",
      itemList: [],
      title: "Test Tags",
    };

    const handleExitComplete = (value: string) => {
      setRenderItems((prev) => {
        if (!prev.has(value)) return prev;
        const next = prev.clone();
        next.delete(value);
        return next;
      });
    };

    const { pageId, itemList, title, ...rest } = props;

    const DynamicTagList = withListMapper(DynamicTag);
    const { container } = await render(
      <DynamicTagList
        items={Array.from(renderItems.entries())}
        optional={([value, itemDetails]) => {
          return {
            value,
            itemDetails,
          };
        }}
        onExitComplete={handleExitComplete}
        {...rest}
      />,
    );
    expect(container).toBeDefined();
  });

  it("Case 8 : ListMapper with optional as non function should validate component props", async () => {
    const handleValueChange = (
      newValue: number[],
      student?: EvaluationSliderProps,
    ) => {
      expect(newValue).toBeDefined();
      expect(student).toBeUndefined();
    };

    const { container } = await render(
      <EvaluationSliderList
        items={students}
        optional={{ value: [0] }}
        onValueChange={handleValueChange}
      />,
    );

    expect(container).toBeDefined();
  });

  it("Case 9 : ListMapper with optional that doesn't match component props should be rejected", async () => {
    const handleValueChange = (
      newValue: number[],
      student?: EvaluationSliderProps,
    ) => {
      expect(newValue).toBeDefined();
      expect(student).toBeUndefined();
    };

    const { container } = await render(
      // @ts-expect-error optional "test" doesn't match the expected type of the component props since the component expect a "value" field in the optional, not a "test" field
      <EvaluationSliderList
        items={students}
        optional={{ test: [0] }}
        onValueChange={handleValueChange}
      />,
    );

    expect(container).toBeDefined();
  });

  it("Case 10 : Case 9 highlights an issue with optional function return value not being fully typed, so an empty return shouldn't be accepted too", async () => {
    const handleValueChange = (
      newValue: number[],
      student?: EvaluationSliderProps,
    ) => {
      expect(newValue).toBeDefined();
      expect(student).toBeUndefined();
    };

    const { container } = await render(
      // @ts-expect-error the optional function return lacks the required `value` property and an empty object should not be allowed
      <EvaluationSliderList
        items={students}
        optional={(student) => {
          return {};
        }}
        onValueChange={handleValueChange}
      />,
    );
    expect(container).toBeDefined();
  });
});
