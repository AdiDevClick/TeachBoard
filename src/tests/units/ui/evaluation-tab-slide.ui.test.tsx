import {
  content,
  contentLeftSide,
  contentRightSide,
  evaluationPageContainer,
  evaluationPageContentContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

function EvaluationSlideHarness() {
  const [value, setValue] = useState<"one" | "two">("one");
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = (next: "one" | "two") => {
    const panel = document.querySelector<HTMLElement>(
      '[data-slot="tabs-content"][data-state="active"]',
    );

    const right = panel?.querySelector<HTMLElement>(
      '[data-testid="right-one"], [data-testid="right-two"]',
    );
    const left = panel?.querySelector<HTMLElement>(
      '[data-testid="left-one"], [data-testid="left-two"]',
    );

    if (!right) {
      setValue(next);
      return;
    }

    setIsAnimating(true);

    // Animate the outgoing panel in-place and switch route only after the
    // animation completes. Cloning is disallowed in the harness (behaviour must
    // not duplicate visible content).
    const rightToX = next === "two" ? "-20rem" : "20rem";
    const leftToX = next === "two" ? "20rem" : "-20rem"; // inverted for left-side

    let remaining = 0;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) {
        setIsAnimating(false);
        setValue(next);
      }
    };

    if (right) {
      remaining += 1;
      const animation = right.animate(
        [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: `translateX(${rightToX})` },
        ],
        {
          duration: 240,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );

      animation.onfinish = done;
      animation.oncancel = done;
    }

    if (left) {
      remaining += 1;
      const animationLeft = left.animate(
        [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: `translateX(${leftToX})` },
        ],
        {
          duration: 240,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );

      animationLeft.onfinish = done;
      animationLeft.oncancel = done;
    }

    if (remaining === 0) {
      setIsAnimating(false);
      setValue(next);
    }
  };

  return (
    <Tabs
      data-testid="harness-root"
      data-animating={isAnimating}
      value={value}
      onValueChange={() => undefined}
      data-slide-direction="right"
    >
      <Button type="button" onClick={() => goTo("two")}>
        Suivant
      </Button>
      <Button type="button" onClick={() => goTo("one")}>
        Précédent
      </Button>

      <TabsContent
        id="panel-one"
        value="one"
        className={evaluationPageContainer}
      >
        <div className={evaluationPageContentContainer}>
          <div className={content}>
            <div data-testid="left-one" className={contentLeftSide}>
              Left one
            </div>
            <div data-testid="right-one" className={contentRightSide}>
              Right one
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        id="panel-two"
        value="two"
        className={evaluationPageContainer}
      >
        <div className={evaluationPageContentContainer}>
          <div className={content}>
            <div data-testid="left-two" className={contentLeftSide}>
              Left two
            </div>
            <div data-testid="right-two" className={contentRightSide}>
              Right two
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

describe("UI: evaluation tab slide-out", () => {
  test("anime la sortie via WAAPI avant le switch de tab", async () => {
    await render(<EvaluationSlideHarness />);

    await page.getByRole("button", { name: "Suivant" }).click();

    await expect
      .poll(() => {
        const root = document.querySelector<HTMLElement>(
          '[data-testid="harness-root"]',
        );
        return root?.dataset.animating ?? "false";
      })
      .toBe("true");

    /* cloning is disallowed when another element of the same type exists;
       outgoing animation must run on the original panel's left-side */
    await expect
      .poll(() =>
        document.querySelector("[data-exit-clone]") ? "clone" : "no-clone",
      )
      .toBe("no-clone");

    await expect
      .poll(() => {
        const panel = document.getElementById("panel-one"); // outgoing panel
        const leftOne = panel?.querySelector<HTMLElement>(
          '[data-testid="left-one"]',
        );
        const anim = leftOne?.getAnimations()?.[0];
        if (!anim) return "no-anim";
        const kfs = (anim.effect as any).getKeyframes?.();
        return kfs ? (kfs[kfs.length - 1].transform ?? "none") : "none";
      })
      .toMatch(/20rem/);

    await expect
      .poll(() => {
        const panel = document.getElementById("panel-two");
        return panel?.dataset.state ?? "inactive";
      })
      .toBe("active");

    /* left-side content is present on the newly active panel */
    await expect
      .poll(() => {
        const leftTwo = document.querySelector('[data-testid="left-two"]');
        return leftTwo ? "present" : "missing";
      })
      .toBe("present");

    /* right column container must clip overflowing children */
    await expect
      .poll(() => {
        const right = document.querySelector('[data-testid="right-two"]');
        return getComputedStyle(right as Element).overflow || "none";
      })
      .toBe("hidden");
  });
});
