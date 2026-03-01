import { LabelledInputWithEventEnrichedMetadatas } from "@/components/Inputs/exports/labelled-input.exports";
import { LabelledInput } from "@/components/Inputs/LabelledInput";
import type { LabelledInputProps } from "@/components/Inputs/types/inputs.types";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import type {
  IsAssignable,
  IsSame,
  ShouldReject,
} from "@/utils/types/types.utils";
import type { ChangeEvent, ComponentProps } from "react";
import { expect, it } from "vitest";
/**
 * This test suite verifies the TypeScript typings of the `withEventEnrichedMetadatas` HOC when applied to a base component (in this case, `LabelledInput`).  It ensures that:
 * 1. The base component (`LabelledInput`) accepts only the expected props defined in `LabelledInputProps`.
 * 2. The enriched component (`LabelledInputWithEventEnrichedMetadatas`) accepts both the original props and the additional enrichment props.
 * 3 . Any unexpected or "funny" props are correctly rejected by TypeScript's type system.
 *
 * Note: These tests are sollely focused on TypeScript type checking and do not perform any runtime assertions on the component's behavior or rendering.
 */

const { render } = await import("vitest-browser-react");

type Props = ComponentProps<typeof LabelledInputWithEventEnrichedMetadatas>;

const basePayload = {
  name: "foo",
  title: "title",
  placeholder: "enter",
  className: "test",
  // enrichment fields
  setRef: () => {},
  task: "apple-login" as AppModalNames,
  apiEndpoint: "/api",
  dataReshapeFn: (data: unknown) => data,
};

const legitimateEnrichedPayload = {
  ...basePayload,
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    metadata: CommandHandlerFieldMeta,
  ) => {
    expect(e.target).toBeDefined();
    expect(metadata).toBeDefined();
  },
};

const funnyPropPayload = {
  ...basePayload,
  onChange: ({
    e,
    metadata,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    metadata: CommandHandlerFieldMeta;
  }) => {
    expect(e.target).toBeDefined();
    expect(metadata).toBeDefined();
  },
};

const _typedLegitimateEnrichedPayload: Props = {
  ...basePayload,
  onClick: (params) => {
    expect(params).toBeDefined();
    expect(params.apiEndpoint).toBeDefined();
    expect(params.dataReshapeFn).toBeDefined();
  },
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    metadata: CommandHandlerFieldMeta,
  ) => {
    expect(e.target).toBeDefined();
    expect(metadata).toBeDefined();
  },
};

// verify that LabelledInput itself only accepts the expected props.  we
// choose a small set of "required" values for the purpose of this test.
// typescript will flag any mismatch at compile time.
it("Case 1 : base component has correct typing", async () => {
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
  const isExact: IsSame<
    ComponentProps<typeof LabelledInput>,
    LabelledInputProps
  > = true;
  expect(isExact).toBe(true);
});

it("Case 2 : enriched component accepts enrichment props", async () => {
  const isAssignable: IsAssignable<typeof legitimateEnrichedPayload, Props> =
    true;

  const { container } = await render(
    <LabelledInputWithEventEnrichedMetadatas {...legitimateEnrichedPayload} />,
  );
  expect(isAssignable).toBe(true);
  expect(container).toBeDefined();
});

it("Case 3 : funny props shouldn't be accepted", async () => {
  const assertReject: ShouldReject<typeof funnyPropPayload, Props> = true;

  const { container } = await render(
    <LabelledInputWithEventEnrichedMetadatas {...funnyPropPayload} />,
  );
  expect(assertReject).toBe(true);
  expect(container).toBeDefined();
});

it("Case 4 : inline funny props shouldn't be accepted", async () => {
  const assertRejected: ShouldReject<
    typeof legitimateEnrichedPayload & {
      myFunnyPropThatShouldNotExist: string;
    },
    Props
  > = true;

  const { container } = await render(
    <LabelledInputWithEventEnrichedMetadatas
      {...legitimateEnrichedPayload}
      myFunnyPropThatShouldNotExist="hello"
    />,
  );
  expect(assertRejected).toBe(true);
  expect(container).toBeDefined();
});
