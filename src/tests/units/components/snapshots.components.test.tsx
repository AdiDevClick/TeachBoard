import { LoginButton } from "@/components/Buttons/LoginButton";
import { SimpleAddButtonWithToolTip } from "@/components/Buttons/SimpleAddButton";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

// Simple, Storybook-style snapshot tests for a few presentational components

describe("Component snapshots (storybook style)", () => {
  test("LoginButton snapshot", async () => {
    await render(
      <AppTestWrapper>
        <LoginButton
          name="Sign in with Google"
          path="/icons/google.svg"
          url="/auth/google"
        />
      </AppTestWrapper>
    );

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  test("SimpleAddButtonWithToolTip snapshot", async () => {
    await render(
      <AppTestWrapper>
        <SimpleAddButtonWithToolTip toolTipText="Ajouter" onClick={() => {}} />
      </AppTestWrapper>
    );

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  test("VerticalFieldSelect snapshot (label + children)", async () => {
    await render(
      <AppTestWrapper>
        <VerticalFieldSelect label="Tâche" placeholder="Choisir...">
          <div data-testid="item">Task 1</div>
        </VerticalFieldSelect>
      </AppTestWrapper>
    );

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
