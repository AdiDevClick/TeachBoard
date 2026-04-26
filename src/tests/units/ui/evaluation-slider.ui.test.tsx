import { EvaluationSlider } from "@/components/Sliders/EvaluationSlider";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import "@css/index-tailwind.css";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

const criteria = [
  {
    id: "1f13fd97-8f17-6665-8d7e-7f8074923d0a",
    score: 0,
    criterion: "Palier 0",
  },
  {
    id: "1f13fd97-8f17-6666-8d7e-7f8074923d0a",
    score: 25,
    criterion: "Palier 1",
  },
  {
    id: "1f13fd97-8f17-6667-8d7e-7f8074923d0a",
    score: 50,
    criterion: "Palier 2",
  },
  {
    id: "1f13fd97-8f17-6668-8d7e-7f8074923d0a",
    score: 75,
    criterion: "Palier 3",
  },
  {
    id: "1f13fd97-8f17-6669-8d7e-7f8074923d0a",
    score: 100,
    criterion: "Palier 4",
  },
] as const;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI: EvaluationSlider hover zones", () => {
  test("renders one invisible hover zone per criterion with split widths", async () => {
    await render(
      <AppTestWrapper>
        <div className="w-[560px]">
          <EvaluationSlider
            id="student-1"
            fullName="Student One"
            value={[50]}
            criteria={[...criteria]}
          />
        </div>
      </AppTestWrapper>,
    );

    await expect
      .poll(
        () =>
          document.querySelectorAll('[data-slot="slider-hover-zone"]').length,
        {
          timeout: 1500,
        },
      )
      .toBe(5);

    const zones = Array.from(
      document.querySelectorAll('[data-slot="slider-hover-zone"]'),
    ).map((node) => node as HTMLElement);

    expect(zones).toHaveLength(5);
    for (const zone of zones) {
      expect(zone.className).toMatch(/size-2|p-2|rounded-full/);
    }
  });
});
