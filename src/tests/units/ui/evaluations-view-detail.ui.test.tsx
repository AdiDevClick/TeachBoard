import { API_ENDPOINTS } from "@/configs/api.endpoints.config";

import {
  DEFAULT_VALUES_STEPS_CREATION_STATE,
  useEvaluationStepsCreationStore,
} from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import {
  EVALUATION_TABLE_STORE_NAME,
  useEvaluationTableStore,
} from "@/features/evaluations/main/configs/evaluations.configs";
import { EvaluationsView } from "@/features/evaluations/main/EvaluationsView";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import {
  firsteval,
  secondeval,
} from "@/tests/samples/evaluations-payload.datas.tests";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { testQueryClient } from "@/tests/test-utils/testQueryClient";
import {
  documentToHaveRoleWithName,
  getFetchCallsByUrl,
  rxExact,
  stubFetchRoutes,
} from "@/tests/test-utils/vitest-browser.helpers";
import { DEFAULT_PERSIST_NAME } from "@/utils/TableStoreRegistry";
import { set } from "idb-keyval";
import type { RouteObject } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

type EvaluationPayload = DetailedEvaluationView;

const evaluationPayload: EvaluationPayload = firsteval;
const secondPayload: EvaluationPayload = secondeval;
const evaluationModules = evaluationPayload.attendedModules ?? [];
const secondModules = secondPayload.attendedModules ?? [];

function buildSecondEvaluationOnePresentPayload(): EvaluationPayload {
  const studentForcedAbsent = evaluationPayload.evaluations[0];

  if (!studentForcedAbsent) {
    return secondPayload;
  }

  const absentStudents = [...secondPayload.absentStudents];

  if (
    !absentStudents.some((student) => student.id === studentForcedAbsent.id)
  ) {
    absentStudents.push({
      id: studentForcedAbsent.id,
      name: studentForcedAbsent.name,
    });
  }

  return {
    ...secondPayload,
    absentStudents,
    evaluations: secondPayload.evaluations.filter(
      (student) => student.id !== studentForcedAbsent.id,
    ),
  };
}

const secondEvaluationOnePresentPayload =
  buildSecondEvaluationOnePresentPayload();

function getAbsentStudentIds(payload: EvaluationPayload) {
  return payload.absentStudents.map((student) => student.id);
}

function getAbsentStudentNames(
  payload: EvaluationPayload,
  studentIds: string[],
) {
  const namesById = new Map(
    payload.absentStudents.map((student) => [student.id, student.name]),
  );

  return studentIds.map((studentId) => namesById.get(studentId) ?? studentId);
}

function resolveAbsenceNameById(payload: EvaluationPayload, studentId: string) {
  const student = payload.absentStudents.find((item) => item.id === studentId);

  return student?.name ?? studentId;
}

function buildExpectedScoresFromPayload(payload: EvaluationPayload) {
  const expectedScores = new Map<string, Map<string, Map<string, number>>>();

  for (const module of payload.attendedModules ?? []) {
    const moduleScores = new Map<string, Map<string, number>>();

    for (const subSkill of module.subSkills) {
      const matchedStudent = payload.evaluations.find((studentEvaluation) => {
        const matchedModule = studentEvaluation.modules.find(
          (evaluatedModule) => evaluatedModule.id === module.id,
        );

        return matchedModule?.subSkills.some((item) => item.id === subSkill.id);
      });

      if (!matchedStudent) {
        continue;
      }

      const matchedScore = matchedStudent.modules
        .find((evaluatedModule) => evaluatedModule.id === module.id)
        ?.subSkills.find((item) => item.id === subSkill.id)?.score;

      if (matchedScore == null) {
        continue;
      }

      moduleScores.set(
        subSkill.name,
        new Map([[matchedStudent.name, matchedScore]]),
      );
    }

    if (moduleScores.size > 0) {
      expectedScores.set(module.name, moduleScores);
    }
  }

  return expectedScores;
}

const evaluationEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(
  evaluationPayload.id,
);
const classEndpoint = API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID(
  evaluationPayload.classId,
);
const evaluationTablePersistKey = `${DEFAULT_PERSIST_NAME}:${EVALUATION_TABLE_STORE_NAME}`;

function normalizeText(value: string) {
  return value.replaceAll(/\s+/g, " ").trim().toLowerCase();
}

function buildRoutes(): RouteObject[] {
  return [
    {
      path: "/evaluations/:evaluationId",
      element: <EvaluationsView />,
    },
  ];
}

function EvaluationSwitchHarness() {
  const { evaluationId } = useParams();

  return (
    <>
      <Link to={`/evaluations/${evaluationPayload.id}`}>Voir évaluation 1</Link>
      <Link to={`/evaluations/${secondPayload.id}`}>Voir évaluation 2</Link>
      <EvaluationsView key={evaluationId} />
    </>
  );
}

function buildRoutesWithSwitchHarness(): RouteObject[] {
  return [
    {
      path: "/evaluations/:evaluationId",
      element: <EvaluationSwitchHarness />,
    },
  ];
}

function installEvaluationDetailFetchStub(
  secondEvaluationPayload = secondPayload,
) {
  stubFetchRoutes({
    getRoutes: [
      [evaluationEndpoint, evaluationPayload],
      [
        API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(secondPayload.id),
        secondEvaluationPayload,
      ],
    ],
    defaultGetPayload: [],
  });
}

function seedEvaluationDetailCache(payload = evaluationPayload) {
  testQueryClient.setQueryData(
    [
      "evaluation-summary",
      API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(payload.id),
    ],
    API_ENDPOINTS.GET.EVALUATIONS.dataReshape(payload),
  );
}

async function seedEvaluationDetailInIdb(payload = evaluationPayload) {
  useEvaluationTableStore.setState({ data: [], hasHydrated: false });

  await set(
    evaluationTablePersistKey,
    JSON.stringify({
      state: { data: [payload] },
      version: 0,
    }),
  );

  await useEvaluationTableStore.persistMap.idb.rehydrate();
}

function getEvaluationDetailGetCallsCount(evaluationId = evaluationPayload.id) {
  return getFetchCallsByUrl(
    API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(evaluationId),
    "GET",
  ).length;
}

function getClassGetCallsCount() {
  return getFetchCallsByUrl(classEndpoint, "GET").length;
}

function findSubSkillCard(subSkillName: string) {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("div.rounded-xl"),
  );

  return (
    cards.find((card) => {
      const header = card.querySelector<HTMLElement>(
        '[data-slot="item-header"]',
      );

      if (!header) {
        return false;
      }

      return (
        normalizeText(header.textContent ?? "") === normalizeText(subSkillName)
      );
    }) ?? null
  );
}

function getSliderValueForStudent(subSkillName: string, studentName: string) {
  const card = findSubSkillCard(subSkillName);

  if (!card) {
    return null;
  }

  const rows = Array.from(
    card.querySelectorAll<HTMLElement>('[data-slot="evaluation-student"]'),
  );
  const matchingRow = rows.find((row) =>
    normalizeText(row.textContent ?? "").includes(normalizeText(studentName)),
  );

  if (!matchingRow) {
    return null;
  }

  const slider = matchingRow.querySelector<HTMLElement>('[role="slider"]');

  return slider?.getAttribute("aria-valuenow") ?? null;
}

function getAbsenceSectionText() {
  const section = document.getElementById("dynamic-tag-roles");

  return section?.textContent ?? "";
}

async function expectAbsenceSectionToMatch(
  payload: EvaluationPayload,
  expectedAbsentIds: string[],
  unexpectedAbsentIds: string[] = [],
) {
  const expectedNames = getAbsentStudentNames(payload, expectedAbsentIds).map(
    normalizeText,
  );
  const unexpectedNames = getAbsentStudentNames(
    payload,
    unexpectedAbsentIds,
  ).map(normalizeText);

  await expect
    .poll(() => {
      const absenceSectionText = normalizeText(getAbsenceSectionText());
      const includesExpectedNames = expectedNames.every((name) =>
        absenceSectionText.includes(name),
      );
      const excludesUnexpectedNames = unexpectedNames.every(
        (name) => !absenceSectionText.includes(name),
      );

      return includesExpectedNames && excludesUnexpectedNames;
    })
    .toBe(true);
}

function hasStudentOverallScore(studentName: string, score: number) {
  const pageText = normalizeText(document.body.textContent ?? "");
  const normalizedStudentName = normalizeText(studentName);
  const scorePattern = new RegExp(String.raw`\b${score}(?:\.0)?\s*/\s*20`);

  let nameIndex = pageText.indexOf(normalizedStudentName);

  while (nameIndex >= 0) {
    const nearbyText = pageText.slice(nameIndex, nameIndex + 600);

    if (scorePattern.test(nearbyText)) {
      return true;
    }

    nameIndex = pageText.indexOf(
      normalizedStudentName,
      nameIndex + normalizedStudentName.length,
    );
  }

  return false;
}

setupUiTestState(null, {
  beforeEach: async () => {
    useEvaluationStepsCreationStore.setState(
      DEFAULT_VALUES_STEPS_CREATION_STATE,
    );
    useEvaluationTableStore.persistMap.idb.clearStorage();
    useEvaluationTableStore.setState({ data: [], hasHydrated: true });
    installEvaluationDetailFetchStub();
  },
});

describe("UI flow: evaluations detail view", () => {
  test("fetches correct ids and renders modules, scores, absences, and comments from payload", async () => {
    const initialEvaluationGetCalls = getEvaluationDetailGetCallsCount();

    await render(
      <AppTestWrapper
        routes={buildRoutes()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expect
      .poll(
        () => getEvaluationDetailGetCallsCount() > initialEvaluationGetCalls,
      )
      .toBe(true);

    await expect
      .poll(() => getFetchCallsByUrl(classEndpoint, "GET").length)
      .toBe(0);

    expect(
      getFetchCallsByUrl(
        API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(secondPayload.id),
        "GET",
      ),
    ).toHaveLength(0);

    for (const module of evaluationModules) {
      await documentToHaveRoleWithName("button", rxExact(module.name));
    }

    const secondEvaluationOnlyModule = secondModules.find(
      (module) => !evaluationModules.some((item) => item.id === module.id),
    );

    if (!secondEvaluationOnlyModule) {
      throw new TypeError(
        "Expected a module available only in second evaluation",
      );
    }

    expect(
      page
        .getByRole("button", { name: rxExact(secondEvaluationOnlyModule.name) })
        .query(),
    ).toBeNull();

    const expectedScores = buildExpectedScoresFromPayload(evaluationPayload);

    for (const [moduleName, subSkills] of expectedScores.entries()) {
      const moduleTrigger = page.getByRole("button", {
        name: rxExact(moduleName),
      });

      await userEvent.click(moduleTrigger);

      await expect
        .poll(() => moduleTrigger.query()?.dataset.state)
        .toBe("open");

      for (const [subSkillName, studentScores] of subSkills.entries()) {
        await expect.poll(() => !!findSubSkillCard(subSkillName)).toBe(true);

        for (const [studentName, score] of studentScores.entries()) {
          await expect
            .poll(() => getSliderValueForStudent(subSkillName, studentName))
            .toBe(String(score));
        }
      }
    }

    for (const studentEvaluation of evaluationPayload.evaluations) {
      if (
        !studentEvaluation.isPresent ||
        studentEvaluation.overallScore == null
      ) {
        continue;
      }

      const studentName = studentEvaluation.name;

      await expect
        .poll(
          () =>
            hasStudentOverallScore(
              studentName,
              Number(studentEvaluation.overallScore),
            ),
          { timeout: 500 },
        )
        .toBe(true);
    }

    for (const absentStudentId of getAbsentStudentIds(evaluationPayload)) {
      const absentStudentName = resolveAbsenceNameById(
        evaluationPayload,
        absentStudentId,
      );

      await expect
        .poll(() =>
          normalizeText(getAbsenceSectionText()).includes(
            normalizeText(absentStudentName),
          ),
        )
        .toBe(true);
    }

    await expect
      .poll(() => /\baucun\b/i.test(getAbsenceSectionText()))
      .toBe(false);

    await expect
      .poll(() =>
        normalizeText(document.body.textContent ?? "").includes(
          normalizeText(evaluationPayload.comments ?? ""),
        ),
      )
      .toBe(true);
  });

  test("refreshes rendered data when navigating to another evaluation without F5", async () => {
    await render(
      <AppTestWrapper
        routes={buildRoutesWithSwitchHarness()}
        initialEntries={[`/evaluations/${secondPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName("heading", rxExact(secondPayload.title));

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 1/i }),
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 2/i }),
    );

    await documentToHaveRoleWithName("heading", rxExact(secondPayload.title));

    const secondOnlyModule = secondModules.find(
      (module) => !evaluationModules.some((item) => item.id === module.id),
    );

    if (!secondOnlyModule) {
      throw new TypeError(
        "Expected one module available only in second evaluation",
      );
    }

    await documentToHaveRoleWithName("button", rxExact(secondOnlyModule.name));

    await expect
      .poll(() => hasStudentOverallScore("Raz Fitz", 15), { timeout: 500 })
      .toBe(true);

    for (const absentStudentId of getAbsentStudentIds(secondPayload)) {
      const absentStudentName = resolveAbsenceNameById(
        secondPayload,
        absentStudentId,
      );

      await expect
        .poll(() =>
          normalizeText(getAbsenceSectionText()).includes(
            normalizeText(absentStudentName),
          ),
        )
        .toBe(true);
    }
  });

  test("renders properly from cached evaluation payload without extra fetches", async () => {
    seedEvaluationDetailCache(evaluationPayload);
    const initialEvaluationGetCalls = getEvaluationDetailGetCallsCount();
    const initialClassGetCalls = getClassGetCallsCount();

    await render(
      <AppTestWrapper
        routes={buildRoutes()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expect
      .poll(() => getEvaluationDetailGetCallsCount())
      .toBe(initialEvaluationGetCalls);
    await expect.poll(() => getClassGetCallsCount()).toBe(initialClassGetCalls);

    await expect
      .poll(
        () =>
          evaluationModules.every((module) =>
            Boolean(
              page.getByRole("button", { name: rxExact(module.name) }).query(),
            ),
          ),
        { timeout: 500 },
      )
      .toBe(true);

    for (const module of evaluationModules) {
      await documentToHaveRoleWithName("button", rxExact(module.name));
    }

    await expectAbsenceSectionToMatch(
      evaluationPayload,
      getAbsentStudentIds(evaluationPayload),
    );

    await expect
      .poll(() =>
        normalizeText(document.body.textContent ?? "").includes(
          normalizeText(evaluationPayload.comments ?? ""),
        ),
      )
      .toBe(true);
  });

  test("does not fetch when idb already contains detailed evaluation", async () => {
    await seedEvaluationDetailInIdb(evaluationPayload);
    const initialEvaluationGetCalls = getEvaluationDetailGetCallsCount();
    const initialClassGetCalls = getClassGetCallsCount();

    await render(
      <AppTestWrapper
        routes={buildRoutes()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expect
      .poll(() => getEvaluationDetailGetCallsCount())
      .toBe(initialEvaluationGetCalls);
    await expect.poll(() => getClassGetCallsCount()).toBe(initialClassGetCalls);
  });

  test("does not fetch on reload when idb contains same id without detailed modules", async () => {
    await seedEvaluationDetailInIdb({
      ...evaluationPayload,
      attendedModules: [],
    });
    const initialEvaluationGetCalls = getEvaluationDetailGetCallsCount();
    const initialClassGetCalls = getClassGetCallsCount();

    await render(
      <AppTestWrapper
        routes={buildRoutes()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expect
      .poll(() => getEvaluationDetailGetCallsCount())
      .toBe(initialEvaluationGetCalls);
    await expect.poll(() => getClassGetCallsCount()).toBe(initialClassGetCalls);
  });

  test("fetches on reload when id is missing from idb", async () => {
    await seedEvaluationDetailInIdb({
      ...evaluationPayload,
      id: secondPayload.id,
    });
    const initialEvaluationGetCalls = getEvaluationDetailGetCallsCount();
    const initialClassGetCalls = getClassGetCallsCount();

    await render(
      <AppTestWrapper
        routes={buildRoutes()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expect
      .poll(
        () => getEvaluationDetailGetCallsCount() > initialEvaluationGetCalls,
      )
      .toBe(true);
    await expect.poll(() => getClassGetCallsCount()).toBe(initialClassGetCalls);
  });

  test("keeps absence names synchronized after 1 -> 2 -> 1 navigation", async () => {
    installEvaluationDetailFetchStub(secondEvaluationOnePresentPayload);

    const firstEvaluationOnlyPresentStudentId = evaluationPayload.evaluations
      .map((studentEvaluation) => studentEvaluation.id)
      .find((studentId) =>
        getAbsentStudentIds(secondEvaluationOnePresentPayload).includes(
          studentId,
        ),
      );

    if (!firstEvaluationOnlyPresentStudentId) {
      throw new TypeError(
        "Expected one student present in first evaluation and absent in second evaluation",
      );
    }

    await render(
      <AppTestWrapper
        routes={buildRoutesWithSwitchHarness()}
        initialEntries={[`/evaluations/${evaluationPayload.id}`]}
      />,
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expectAbsenceSectionToMatch(
      evaluationPayload,
      getAbsentStudentIds(evaluationPayload),
      [firstEvaluationOnlyPresentStudentId],
    );

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 2/i }),
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(secondEvaluationOnePresentPayload.title),
    );

    await expectAbsenceSectionToMatch(
      secondEvaluationOnePresentPayload,
      getAbsentStudentIds(secondEvaluationOnePresentPayload),
    );

    await userEvent.click(
      page.getByRole("link", { name: /voir évaluation 1/i }),
    );

    await documentToHaveRoleWithName(
      "heading",
      rxExact(evaluationPayload.title),
    );

    await expectAbsenceSectionToMatch(
      evaluationPayload,
      getAbsentStudentIds(evaluationPayload),
      [firstEvaluationOnlyPresentStudentId],
    );
  });
});
