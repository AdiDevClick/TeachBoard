import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";

import { describe, expect, it, vi } from "vitest";

function expectGroupList(shaped: unknown) {
  expect(Array.isArray(shaped)).toBe(true);
  const list = shaped as any[];
  expect(list.length).toBeGreaterThan(0);
  expect(typeof list[0].groupTitle).toBe("string");
  expect(Array.isArray(list[0].items)).toBe(true);
  return list;
}

describe("API_ENDPOINTS full contract", () => {
  it("exports stable HTTP methods and is frozen", () => {
    expect(API_ENDPOINTS.GET.METHOD).toBe("GET");
    expect(API_ENDPOINTS.POST.METHOD).toBe("POST");
    expect(Object.isFrozen(API_ENDPOINTS)).toBe(true);
  });

  it("provides stable base GET endpoints", () => {
    expect(API_ENDPOINTS.GET.CLASSES.endPoints.ALL).toBe("/api/classes/");
    expect(API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID(123)).toBe(
      "/api/classes/123"
    );

    expect(API_ENDPOINTS.GET.SKILLS.endPoints.MODULES).toBe("/api/skills/main");
    expect(API_ENDPOINTS.GET.SKILLS.endPoints.SUBSKILLS).toBe(
      "/api/skills/sub"
    );

    expect(API_ENDPOINTS.GET.DEGREES.endpoints.LEVEL).toBe(
      "/api/degrees/level"
    );
    expect(API_ENDPOINTS.GET.DEGREES.endpoints.YEAR).toBe("/api/degrees/year");
    expect(API_ENDPOINTS.GET.DEGREES.endpoints.FIELD).toBe(
      "/api/degrees/field"
    );

    expect(API_ENDPOINTS.GET.DIPLOMAS.endpoint).toBe("/api/degrees/config");

    expect(API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.ALL).toBe(
      "/api/task-templates"
    );
    expect(
      API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID("abc")
    ).toBe("/api/task-templates/by-degree-config/abc");

    expect(API_ENDPOINTS.GET.TASKS.endpoint).toBe("/api/tasks");
    expect(API_ENDPOINTS.GET.STUDENTS.endpoint).toBe(
      "/api/students/not-assigned"
    );
    expect(API_ENDPOINTS.GET.TEACHERS.endpoint).toBe("/api/teachers/");

    expect(API_ENDPOINTS.GET.AUTH.SIGNUP_VALIDATION).toBe("/api/auth/verify/");
  });

  it("GET.CLASSES reshaper returns grouped items with value=name", () => {
    const payload = {
      BTS: [{ id: "c1", name: "Classe 1", code: "C1" }],
    };

    const shaped = API_ENDPOINTS.GET.CLASSES.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("BTS");
    expect(list[0].items[0].value).toBe("Classe 1");
  });

  it("GET.SKILLS reshaper returns group Tous and value=code", () => {
    const payload = {
      Skills: [{ id: "s1", code: "JS", name: "JavaScript" }],
    };

    const shaped = API_ENDPOINTS.GET.SKILLS.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0].value).toBe("JS");
  });

  it("GET.DEGREES reshaper returns group Tous and value=name", () => {
    const payload = [{ id: "d1", name: "BTS" }];

    const shaped = API_ENDPOINTS.GET.DEGREES.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0].value).toBe("BTS");
  });

  it("GET.DIPLOMAS reshaper returns tuple groups and value=degreeLevel+year", () => {
    const payload = {
      BTS: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          degreeLevel: "BTS",
          degreeYear: "2024",
          degreeField: "Informatique",
        },
      ],
    };

    const shaped = API_ENDPOINTS.GET.DIPLOMAS.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("BTS");
    expect(list[0].items[0].value).toBe("BTS 2024");
  });

  it("GET.TASKSTEMPLATES reshaper flattens task template and value=name", () => {
    const payload = {
      taskTemplates: [
        {
          id: "44444444-4444-4444-8444-444444444444",
          task: {
            id: "55555555-5555-5555-5555-555555555555",
            name: "Exercice 1",
            description: "Addition",
          },
        },
      ],
      shortTemplatesList: [{ id: "st1" }],
    };

    const shaped = API_ENDPOINTS.GET.TASKSTEMPLATES.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].shortTemplatesList).toEqual([{ id: "st1" }]);
    expect(list[0].items[0].id).toBe("44444444-4444-4444-8444-444444444444");
    expect(list[0].items[0].value).toBe("Exercice 1");
  });

  it("GET.TASKS reshaper returns group Tous and value=name", () => {
    const payload = [{ id: "t1", name: "Devoir 1" }];

    const shaped = API_ENDPOINTS.GET.TASKS.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0].value).toBe("Devoir 1");
  });

  it("GET.STUDENTS reshaper provides value/name and proxy role mapping", () => {
    const payload = [
      {
        id: "22222222-2222-4222-8222-222222222222",
        firstName: "Alice",
        lastName: "Doe",
        img: "img.png",
      },
    ];

    const shaped = API_ENDPOINTS.GET.STUDENTS.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0].value).toBe("Alice Doe");
    expect(list[0].items[0].name).toBe("Alice Doe");
    expect(list[0].items[0].avatar).toBe("img.png");
    expect(list[0].items[0].email).toBe("Etudiant");
  });

  it("GET.TEACHERS reshaper provides value/name and proxy role mapping", () => {
    const payload = [
      {
        id: "33333333-3333-4333-8333-333333333333",
        firstName: "Bob",
        lastName: "Smith",
        img: "img.png",
      },
    ];

    const shaped = API_ENDPOINTS.GET.TEACHERS.dataReshape(payload as any);
    const list = expectGroupList(shaped);

    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0].value).toBe("Bob Smith");
    expect(list[0].items[0].name).toBe("Bob Smith");
    expect(list[0].items[0].avatar).toBe("img.png");
    expect(list[0].items[0].email).toBe("Enseignant");
  });

  it("provides stable base POST endpoints", () => {
    expect(API_ENDPOINTS.POST.CREATE_CLASS.endpoint).toBe("/api/classes");

    expect(API_ENDPOINTS.POST.AUTH.LOGIN.endpoint).toBe("/api/auth/login");
    expect(API_ENDPOINTS.POST.AUTH.SIGNUP).toBe("/api/auth/signup");
    expect(API_ENDPOINTS.POST.AUTH.PASSWORD_CREATION).toBe(
      "/api/auth/password-creation"
    );
    expect(API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.endpoint).toBe(
      "/api/auth/password-recovery"
    );
    expect(API_ENDPOINTS.POST.AUTH.SESSION_CHECK).toBe("/api/auth/session");
    expect(API_ENDPOINTS.POST.AUTH.LOGOUT).toBe("/api/auth/logout");

    expect(API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.LEVEL).toBe(
      "/api/degrees/level"
    );
    expect(API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.YEAR).toBe(
      "/api/degrees/year"
    );
    expect(API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.FIELD).toBe(
      "/api/degrees/field"
    );

    expect(API_ENDPOINTS.POST.CREATE_SKILL.endPoints.MODULE).toBe(
      "/api/skills/main"
    );
    expect(API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL).toBe(
      "/api/skills/sub"
    );

    expect(API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint).toBe(
      "/api/degrees/config"
    );
    expect(API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint).toBe(
      "/api/task-templates"
    );
    expect(API_ENDPOINTS.POST.CREATE_TASK.endpoint).toBe("/api/tasks");
  });

  it("POST.CREATE_CLASS reshaper inserts into cached group and sets value=name", () => {
    const cached = [
      {
        groupTitle: "BTS",
        items: [{ id: "old", name: "old", value: "old" }],
      },
    ];

    const shaped = API_ENDPOINTS.POST.CREATE_CLASS.dataReshape(
      { id: "new", name: "1a", degreeLevel: "BTS" } as any,
      [["k", cached]] as any
    );

    const list = expectGroupList(shaped);
    expect(list[0].groupTitle).toBe("BTS");
    expect(list[0].items.map((i: any) => i.value)).toContain("1a");
  });

  it("POST.AUTH.LOGIN reshaper calls login() with mapped payload", () => {
    const login = vi.fn();

    const raw = {
      user: {
        id: "u1",
        username: "u",
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@test.com",
        role: "Teacher",
        avatar: "a.png",
        schoolName: "TB",
      },
      session: "token",
      refreshToken: "rt",
    };

    const returned = API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape(
      raw as any,
      null as any,
      { login }
    );

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "u1",
        username: "u",
        firstName: "Ada",
        lastName: "Lovelace",
        name: "Ada Lovelace",
        email: "ada@test.com",
        role: "Teacher",
        token: "token",
        refreshToken: "rt",
        avatar: "a.png",
        schoolName: "TB",
      })
    );
    expect(returned).toBe(raw);
  });

  it("POST.CREATE_DEGREE reshaper inserts mapped item (value=name) into cache", () => {
    const cached = [{ groupTitle: "Tous", items: [] }];

    const shaped = API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape(
      { degree: { id: "deg1", name: "BTS" } } as any,
      [["k", cached]] as any
    );

    const list = expectGroupList(shaped);
    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0]).toEqual(
      expect.objectContaining({ id: "deg1", value: "BTS" })
    );
  });

  it("POST.CREATE_SKILL reshaper maps code->value and inserts into cache", () => {
    const cached = [{ groupTitle: "Tous", items: [] }];

    const shaped = API_ENDPOINTS.POST.CREATE_SKILL.dataReshape(
      { skill: { id: "sk1", code: "JS" } } as any,
      [["k", cached]] as any
    );

    const list = expectGroupList(shaped);
    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0]).toEqual(
      expect.objectContaining({ id: "sk1", value: "JS" })
    );
  });

  it("POST.CREATE_DIPLOMA reshaper sets value=level+year and groups by field", () => {
    const cached = [{ groupTitle: "Informatique", items: [] }];

    const shaped = API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape(
      {
        id: "dip1",
        degreeLevel: "BTS",
        degreeYear: "2024",
        degreeField: "Informatique",
      } as any,
      [["k", cached]] as any
    );

    const list = expectGroupList(shaped);
    expect(list[0].groupTitle).toBe("Informatique");
    expect(list[0].items[0]).toEqual(
      expect.objectContaining({ id: "dip1", value: "BTS 2024" })
    );
  });

  it("POST.CREATE_TASK_TEMPLATE reshaper maps to {id,description,value} and inserts", () => {
    const cached = [{ groupTitle: "Tous", items: [], shortTemplatesList: [] }];

    const shaped = API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape(
      { id: "tt1", task: { name: "Ex 1", description: "Addition" } } as any,
      [["k", cached]] as any
    );

    const list = expectGroupList(shaped);
    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0]).toEqual(
      expect.objectContaining({
        id: "tt1",
        description: "Addition",
        value: "Ex 1",
      })
    );
    expect(list[0].shortTemplatesList).toContain("Ex 1");
  });

  it("POST.CREATE_TASK reshaper sets value=name and inserts", () => {
    const cached = [{ groupTitle: "Tous", items: [] }];

    const shaped = API_ENDPOINTS.POST.CREATE_TASK.dataReshape(
      { id: "task1", name: "Devoir 1" } as any,
      [["k", cached]] as any
    );

    const list = expectGroupList(shaped);
    expect(list[0].groupTitle).toBe("Tous");
    expect(list[0].items[0]).toEqual(
      expect.objectContaining({ id: "task1", value: "Devoir 1" })
    );
  });
});
