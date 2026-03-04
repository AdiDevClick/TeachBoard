import type { ChangeEvent, ComponentProps } from "react";
import { beforeEach, expect, it } from "vitest";

import withController from "@/components/HOCs/withController";
import { ControlledLabelledInput } from "@/components/Inputs/exports/labelled-input.exports";
import { LabelledInput } from "@/components/Inputs/LabelledInput";
import type { LabelledInputProps } from "@/components/Inputs/types/inputs.types";
import type { AppModalNames } from "@/configs/app.config.ts";
import {
  type ClassCreationFormSchema,
  classCreationSchema,
} from "@/features/class-creation/components/main/models/class-creation.models";
import { DEFAULT_SCHOOL_YEAR } from "@/features/class-creation/components/main/config/class-creation.configs";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import type { IsAssignable, ShouldReject } from "@/utils/types/types.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

/**
 * This test suite verifies the TypeScript typings of the `withController` HOC when applied to a base component (in this case, `LabelledInput`).  It ensures that:
 * 1. The base component (`LabelledInput`) accepts only the expected props defined in `LabelledInputProps`.
 * 2. The controlled component (`ControlledLabelledInput`) accepts both the original props and the additional controller props.
 * 3. The component uses the enriched metadata props correctly typed, and any unexpected or "funny" props are correctly rejected by TypeScript's type system.
 *
 * Note: These tests are sollely focused on TypeScript type checking and do not perform any runtime assertions on the component's behavior or rendering.
 */

let form: ReturnType<typeof useForm<ClassCreationFormSchema>> | null = null;
const ControllerInput = withController(LabelledInput);

beforeEach(async () => {
  const { result } = await renderHook(() =>
    useForm<ClassCreationFormSchema>({
      resolver: zodResolver(classCreationSchema),
      mode: "onTouched",
      defaultValues: {
        name: "",
        description: "",
        schoolYear: DEFAULT_SCHOOL_YEAR,
        students: [],
        degreeConfigId: "",
        userId: "props.userId",
        primaryTeacherId: "",
        tasks: [],
      },
    }),
  );
  form = result.current;
});

type ControlledProps = ComponentProps<typeof ControlledLabelledInput>;
type ControllerInputProps = ComponentProps<typeof ControllerInput>;
// small base payload for the original input component
const basePayload = {
  name: "foo",
  title: "title",
  placeholder: "enter",
  className: "test",
};

const legitimateControlledPayload = {
  ...basePayload,
  setRef: () => {},
  task: "apple-login" as AppModalNames,
  apiEndpoint: "/api",
  dataReshapeFn: (d: unknown) => d,
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    meta: CommandHandlerFieldMeta,
  ) => {
    expect(e.target).toBeDefined();
    expect(meta).toBeDefined();
  },
};

const myFunnyPropThatShouldNotExist = "hello";

const funnyControllerPayload = {
  ...legitimateControlledPayload,
  myFunnyPropThatShouldNotExist,
};

const typedFunnyControllerPayload: ControlledProps = {
  ...legitimateControlledPayload,
  // @ts-expect-error : onChange should receive enriched metadata, not just the event
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
};

// verify that controller itself accepts the expected props.
const _typedLegitimateControlledPayload = {
  ...basePayload,
  setRef: () => {},
  task: "apple-login" as AppModalNames,
  apiEndpoint: "/api",
  dataReshapeFn: (d: unknown) => d,
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    meta: CommandHandlerFieldMeta,
  ) => {
    expect(e.target).toBeDefined();
    expect(meta).toBeDefined();
  },
} satisfies ControlledProps;

void _typedLegitimateControlledPayload;
// verify that LabelledInput itself only accepts the expected props.  we
// choose a small set of "required" values for the purpose of this test.
// typescript will flag any mismatch at compile time.
it("Case 0 : base component has correct typing", async () => {
  const basePayload: LabelledInputProps = {
    name: "foo",
    title: "title",
    onChange: (e) => {
      expect(e.target).toBeDefined();
    },
  };
  const { container } = await render(<LabelledInput {...basePayload} />);
  expect(container).toBeDefined();

  // make sure the component props exactly match the declared type
  const isExact: IsAssignable<typeof basePayload, LabelledInputProps> = true;
  expect(isExact).toBe(true);
});

it("Case 0.5: controlled component with Controller", async () => {
  const controlledPayload = {
    control: form?.control,
    name: "foo",
    title: "title",
    setRef: (el: unknown) => el,
    onChange: (
      e: ChangeEvent<HTMLInputElement>,
      meta: CommandHandlerFieldMeta,
    ) => {
      expect(e.target).toBeDefined();
      expect(meta).toBeDefined();
    },
  };

  // make sure the component props exactly match the declared type
  const isExact: IsAssignable<typeof controlledPayload, ControllerInputProps> =
    true;

  const { container } = await render(
    <ControllerInput {...controlledPayload} />,
  );

  expect(isExact).toBe(true);
  expect(container).toBeDefined();
});

it("Case 0.6: controlled component should reject funny props", async () => {
  const controlledPayload = {
    control: form?.control,
    title: "title",
    setRef: (el: unknown) => el,
    onChange: ({
      e,
      meta,
    }: {
      e: ChangeEvent<HTMLInputElement>;
      meta: CommandHandlerFieldMeta;
    }) => {
      expect(e.target).toBeDefined();
      expect(meta).toBeDefined();
    },
  };

  // make sure the component props exactly match the declared type
  const isExact: ShouldReject<typeof controlledPayload, ControllerInputProps> =
    true;

  const { container } = await render(
    // @ts-expect-error : controlledPayload is missing required props and has incorrect onChange signature, so it should trigger a TS error.
    <ControllerInput {...controlledPayload} />,
  );

  expect(isExact).toBe(true);
  expect(container).toBeDefined();
});

//@deprecated : the use of NoExtraProps types or similar : <T extends object> = T & { [K in Exclude<string, keyof T>]?: never; } is FORBIDDEN
it("Case 1 : controlled component accepts controller/enrichment props", async () => {
  const isAssignable: IsAssignable<
    typeof legitimateControlledPayload,
    ControlledProps
  > = false; //<- Allowed payload !! IMPORTANT !! isAssignable should NOT trigger a TS error Type car on insère le control directement sur la composant.

  const { container } = await render(
    <ControlledLabelledInput
      control={form?.control}
      {...legitimateControlledPayload} //<- Allowed payload !! IMPORTANT !! <ControlledLabelledInput/> should NOT trigger a TS error.
    />,
  );
  expect(isAssignable).toBe(false);
  expect(container).toBeDefined();
});

// <ControlledLabelledInput/> should clearly reject the payload
it("Case 2 : controlled component rejects inline extra props", async () => {
  const isAssignable: IsAssignable<
    typeof legitimateControlledPayload & typeof myFunnyPropThatShouldNotExist,
    ControlledProps
  > = false;

  const assertReject: ShouldReject<
    typeof legitimateControlledPayload & {
      myFunnyPropThatShouldNotExist: string;
    },
    ControlledProps
  > = true;

  const { container } = await render(
    <ControlledLabelledInput
      {...legitimateControlledPayload}
      // @ts-expect-error : myFunnyPropThatShouldNotExist is not allowed on ControlledLabelledInput
      myFunnyPropThatShouldNotExist="hello" //<- Not allowed payload !! IMPORTANT !! <ControlledLabelledInput/> should trigger a TS error.
      control={form?.control}
    />,
  );
  expect(isAssignable).toBe(false);
  expect(assertReject).toBe(true);
  expect(container).toBeDefined();
});

// Spread payload have difficulties with excess property checks - Please try to type your payload before using it until we can fix the spread issue
it("Case 3 : controlled component rejects extra props (checked by helpers)", async () => {
  // compile-time assertions using our helpers
  const isAssignable: IsAssignable<
    typeof funnyControllerPayload,
    ControlledProps
  > = false;

  const assertReject: ShouldReject<
    typeof funnyControllerPayload,
    ControlledProps
  > = true;

  const { container } = await render(
    // @ts-expect-error : funnyControllerPayload contains myFunnyPropThatShouldNotExist which is not allowed on ControlledLabelledInput
    <ControlledLabelledInput
      control={form?.control}
      {...funnyControllerPayload} //<- Not allowed payload !! IMPORTANT !! <ControlledLabelledInput/> should trigger a TS error.
    />,
  );
  expect(isAssignable).toBe(false);
  expect(assertReject).toBe(true);
  expect(container).toBeDefined();
});
