import type { UUID } from "@/api/types/openapi/common.types.ts";
import type {
  ClassDto,
  CreateClassResponseData,
} from "@/api/types/routes/classes.types.ts";
import type {
  CreateDegreeResponseData,
  DegreeRefDto,
  DegreeType,
} from "@/api/types/routes/degrees.types.ts";
import type { DiplomaConfigDto } from "@/api/types/routes/diplomas.types.ts";
import type {
  SkillsViewDto,
  SkillType,
} from "@/api/types/routes/skills.types.ts";
import type { StudentDto } from "@/api/types/routes/students.types.ts";
import type {
  CreateTaskTemplateResponseData,
  TaskTemplateDto,
  TaskTemplatesFetch,
  TaskViewDto,
} from "@/api/types/routes/task-templates.types.ts";
import type { TaskDto } from "@/api/types/routes/tasks.types.ts";
import type { TeacherDto } from "@/api/types/routes/teachers.types.ts";

/**
 * Base class for all fixture creators, providing common utilities.
 */
export class FixtureCreatorBase {
  readonly #id: UUID;

  constructor(id?: UUID) {
    this.#id = id ?? this.#generateId();

    // Expose `id` as an own enumerable accessor so it participates in
    // spreads/JSON and other runtime inspections (many consumers expect
    // `id` to be an own property).
    this.defineEnumerableAccessor("id", this.#id);
  }

  /**
   * Transform any prototype getters into own, enumerable, immutable value
   * properties on the instance. Only defines properties for getters whose
   * evaluation does not return `undefined` (keeps parity with JSON).
   */
  exposeGettersAsValues(params?: unknown): void {
    // If params was passed, define those keys as own value properties as well
    // (useful for response DTOs where constructor receives values that should
    // be present on the instance as-is).
    if (params && typeof params === "object") {
      for (const key of Object.keys(params)) {
        // Skip undefined values to keep parity with JSON
        const value = (params as Record<string, unknown>)[key];

        if (value === undefined) continue;
        // Avoid leaking callback-style params (generators/formatters) into the
        // runtime DTO shape of fixtures.
        if (typeof value === "function") continue;
        if (Object.hasOwn(this, key)) continue;

        this.defineEnumerableAccessor(key, value);
      }
    }
  }

  get id(): UUID {
    return this.#id;
  }

  /**
   * Define an enumerable, immutable value property on the instance.
   * Skips defining the property if the computed value is `undefined`.
   */
  defineEnumerableGetter(key: string, getter: () => unknown): void {
    const value = getter();
    if (value === undefined) return;

    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      writable: false,
      value,
    });
  }

  /**
   * Define an enumerable accessor backed by a non-enumerable symbol value.
   * This creates both an own accessor descriptor (`get`) and a preserved
   * backing value that is not enumerated directly. Using this keeps parity
   * with JSON/spread while also providing a descriptor `get` on the own
   * property.
   */
  defineEnumerableAccessor(key: string, value: unknown): void {
    if (value === undefined || Object.hasOwn(this, key)) return;

    const backing = Symbol(String(key));
    Object.defineProperty(this, backing, {
      value,
      enumerable: false,
      configurable: false,
      writable: false,
    });

    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      get: () => (this as unknown as Record<string | symbol, unknown>)[backing],
    });
  }

  #generateId(): UUID {
    // Simple UUID generator for fixture purposes
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replaceAll(
      /[xy]/g,
      function (c) {
        const r = Math.trunc(Math.random() * 16),
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomBool(trueProbability = 0.5): boolean {
    return Math.random() < trueProbability;
  }

  randomHex(length: number, options?: { upper?: boolean }): string {
    const alphabet =
      options?.upper === false ? "0123456789abcdef" : "0123456789ABCDEF";
    let out = "";
    for (let i = 0; i < length; i += 1) {
      out += alphabet.charAt(this.randomInt(0, alphabet.length - 1));
    }
    return out;
  }

  stripDiacritics(value: string): string {
    return value.normalize("NFD").replaceAll(/[\u0300-\u036f]/g, "");
  }

  lettersOnlyUpper(value: string): string {
    return this.stripDiacritics(value)
      .replaceAll(/[^a-zA-Z]/g, "")
      .toUpperCase();
  }

  titleCase(value: string): string {
    if (value.length === 0) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  randomHumanWord(options?: { minLen?: number; maxLen?: number }): string {
    const minLen = options?.minLen ?? 5;
    const maxLen = options?.maxLen ?? 10;
    const targetLen = this.randomInt(minLen, maxLen);

    const vowels = "aeiouy";
    const consonants = "bcdfghjklmnpqrstvwxz";
    let out = "";
    let useConsonant = true;

    while (out.length < targetLen) {
      const pool = useConsonant ? consonants : vowels;
      out += pool.charAt(this.randomInt(0, pool.length - 1));
      useConsonant = !useConsonant;
    }

    return this.titleCase(out);
  }

  codeFromName(name: string, length: number): string {
    const letters = this.lettersOnlyUpper(name);
    const sliced = letters.slice(0, length);
    if (sliced.length === length) return sliced;
    return sliced.padEnd(length, "X");
  }

  emailFromNames(
    firstName: string,
    lastName: string,
    domain = "example.com"
  ): string {
    const emailLocal = `${this.stripDiacritics(
      firstName
    ).toLowerCase()}.${this.stripDiacritics(
      lastName
    ).toLowerCase()}`.replaceAll(/[^a-z0-9.]/g, "");
    return `${emailLocal}@${domain}`;
  }

  generatePerson(params?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): { firstName: string; lastName: string; email: string | undefined } {
    const firstName =
      params?.firstName ?? this.randomHumanWord({ minLen: 3, maxLen: 10 });
    const lastName =
      params?.lastName ?? this.randomHumanWord({ minLen: 4, maxLen: 12 });
    const email = params?.email ?? this.emailFromNames(firstName, lastName);
    return { firstName, lastName, email };
  }
}

export class SkillFixtureCreator extends FixtureCreatorBase {
  /**
   * Skill DTO shape (TypeScript declarations only).
   * Runtime values are set as own enumerable properties by the constructor
   * using `defineEnumerableGetter` so they survive cloning/spread/JSON.
   */
  declare readonly name?: string;
  declare readonly code: string;
  declare readonly type?: SkillType;

  /**
   * Private fields to hold the person properties
   */
  readonly #code: string;

  constructor(params?: {
    id?: UUID;
    name?: string;
    code?: string;
    type?: SkillType;
  }) {
    super(params?.id);

    const fallbackName = this.randomHumanWord({ minLen: 5, maxLen: 12 });
    const nameForCode = params?.name ?? fallbackName;
    this.#code = params?.code ?? this.codeFromName(nameForCode, 3);

    this.exposeGettersAsValues({
      name: fallbackName,
      code: this.#code,
      type: params?.type,
    });
  }
}

export class DegreeFixtureCreator
  extends FixtureCreatorBase
  implements DegreeRefDto
{
  /**
   * Degree reference DTO (TS-only declarations).
   * Values are exposed at runtime as own enumerable properties via the constructor.
   */
  declare readonly name: string;
  declare readonly code: string;
  declare readonly type: DegreeType;

  /**
   * Private fields to hold the person properties
   */
  readonly #name: string;
  readonly #code: string;
  readonly #type: DegreeType;

  constructor(
    type: DegreeType,
    params?: {
      id?: UUID;
      name?: string;
      code?: string;
      yearNumber?: number;
      yearNameFormatter?: (yearNumber: number, yearCode: string) => string;
      nameGenerator?: (type: DegreeType) => string;
      codeGenerator?: (type: DegreeType, name: string) => string;
    }
  ) {
    super(params?.id);
    this.#type = type;

    const name =
      params?.name ??
      (params?.nameGenerator
        ? params.nameGenerator(type)
        : this.#generateDefaultName(type, params));

    this.#name = name;
    this.#code =
      params?.code ??
      (params?.codeGenerator
        ? params.codeGenerator(type, name)
        : this.#generateDefaultCode(type, name, params));

    this.exposeGettersAsValues({
      name: this.#name,
      code: this.#code,
      type: this.#type,
    });
  }

  #generateDefaultName(
    type: DegreeType,
    params?: {
      yearNumber?: number;
      yearNameFormatter?: (yearNumber: number, yearCode: string) => string;
    }
  ): string {
    if (type === "YEAR") {
      const yearNumber = params?.yearNumber ?? this.randomInt(1, 5);
      const yearCode = `${yearNumber}A`;
      return params?.yearNameFormatter
        ? params.yearNameFormatter(yearNumber, yearCode)
        : yearCode;
    }

    // Generic, human-like words (no domain lists inside the class)
    return this.randomHumanWord({ minLen: 5, maxLen: 12 });
  }

  #generateDefaultCode(
    type: DegreeType,
    name: string,
    params?: { yearNumber?: number }
  ): string {
    if (type === "YEAR") {
      const match = /(\d+)/.exec(this.stripDiacritics(name));
      if (match?.[1]) return `${match[1]}A`;
      const yearNumber = params?.yearNumber ?? this.randomInt(1, 5);
      return `${yearNumber}A`;
    }

    // FIELD tends to be 4 letters, LEVEL often 3 letters.
    const codeLen = type === "FIELD" ? 4 : 3;
    return this.codeFromName(name, codeLen);
  }
}

export class TaskFixtureCreator extends FixtureCreatorBase implements TaskDto {
  /**
   * Task DTO shape (TS-only). Runtime values created in constructor.
   */
  declare readonly name: string;
  declare readonly description?: string;

  /**
   * Private fields to hold the person properties
   */
  readonly #name: string;
  readonly #description?: string;

  constructor(params?: { id?: UUID; name?: string; description?: string }) {
    super(params?.id);
    const defaultName = `${this.randomHumanWord({
      minLen: 4,
      maxLen: 10,
    })} ${this.randomHumanWord({ minLen: 4, maxLen: 12 })}`;
    this.#name = params?.name ?? defaultName;
    this.#description = params?.description ?? "...";

    this.exposeGettersAsValues({
      name: this.#name,
      description: this.#description,
    });
  }
}

export class TaskTemplateFixtureCreator
  extends FixtureCreatorBase
  implements TaskTemplateDto
{
  /**
   * TaskTemplate DTO declarations (TypeScript only). Runtime exposure
   * is performed in constructor via own enumerable properties.
   */
  declare readonly name?: string;
  declare readonly task: TaskViewDto & { id: UUID };
  declare readonly degreeConfiguration?: DiplomaConfigDto;
  declare readonly skills?: string[];

  /**
   * Private fields to hold the person properties
   */
  readonly #task: TaskViewDto & { id: UUID };

  constructor(params?: {
    id?: UUID;
    name?: string;
    task?: TaskDto;
    degreeConfiguration?: DiplomaConfigDto;
    skills?: string[];
  }) {
    super(params?.id);

    const task = params?.task ?? new TaskFixtureCreator();
    this.#task = {
      id: task.id,
      name: task.name,
      description: task.description,
    };

    this.exposeGettersAsValues({ ...params, task: this.#task });
  }
}

export class DiplomaConfigFixtureCreator
  extends FixtureCreatorBase
  implements DiplomaConfigDto
{
  /**
   * Diploma configuration DTO declarations (TS-only). Runtime values
   * are exposed as own enumerable properties by the constructor.
   */
  declare readonly degreeLevel: string;
  declare readonly degreeYear: string;
  declare readonly degreeField: string;
  declare readonly skills?: SkillsViewDto[];

  /**
   * Private fields to hold the person properties
   */
  readonly #degreeLevel: string;
  readonly #degreeYear: string;
  readonly #degreeField: string;
  readonly #skills?: SkillsViewDto[];

  constructor(params?: {
    id?: UUID;
    degreeLevel?: string;
    degreeYear?: string;
    degreeField?: string;
    yearNumber?: number;
    skills?: SkillsViewDto[];
  }) {
    super(params?.id);
    this.#degreeLevel =
      params?.degreeLevel ?? this.randomHumanWord({ minLen: 3, maxLen: 10 });

    const yearNumber = params?.yearNumber ?? this.randomInt(1, 5);
    this.#degreeYear = params?.degreeYear ?? `${yearNumber}A`;

    this.#degreeField =
      params?.degreeField ?? this.randomHumanWord({ minLen: 5, maxLen: 14 });
    this.#skills = params?.skills;

    this.exposeGettersAsValues({
      degreeLevel: this.#degreeLevel,
      degreeYear: this.#degreeYear,
      degreeField: this.#degreeField,
      skills: this.#skills,
    });
  }
}

export class SkillsViewFixtureCreator
  extends FixtureCreatorBase
  implements SkillsViewDto
{
  /**
   * Skills view DTO (TS-only declarations). The constructor exposes runtime
   * properties as own enumerable values so they can be spread/cloned.
   */
  declare readonly mainSkillId: UUID;
  declare readonly mainSkillName: string;
  declare readonly mainSkillCode: string;
  declare readonly subSkills: { id: UUID; code: string; name: string }[];

  /**
   * Private fields to hold the person properties
   */
  readonly #mainSkillId: UUID;
  readonly #mainSkillName: string;
  readonly #mainSkillCode: string;
  readonly #subSkills: { id: UUID; code: string; name: string }[];

  constructor(params?: {
    mainSkillId?: UUID;
    mainSkillName?: string;
    mainSkillCode?: string;
    subSkills?: { id?: UUID; code?: string; name?: string }[];
  }) {
    super();
    this.#mainSkillId = params?.mainSkillId ?? this.id;

    const name =
      params?.mainSkillName ?? this.randomHumanWord({ minLen: 5, maxLen: 14 });
    this.#mainSkillName = name;
    this.#mainSkillCode =
      params?.mainSkillCode ??
      `${this.codeFromName(name, 4)}_${this.randomHex(6)}`;

    const rawSubs = params?.subSkills ?? [{}, {}];
    this.#subSkills = rawSubs.map((s) => {
      const subName = s.name ?? this.randomHumanWord({ minLen: 4, maxLen: 12 });
      const subId = s.id ?? new FixtureCreatorBase().id;
      return {
        id: subId,
        name: subName,
        code: s.code ?? `${this.codeFromName(subName, 3)}_${this.randomHex(2)}`,
      };
    });

    this.exposeGettersAsValues({
      mainSkillId: this.#mainSkillId,
      mainSkillCode: this.#mainSkillCode,
      mainSkillName: this.#mainSkillName,
      subSkills: this.#subSkills,
    });
  }
}

export class PersonFixtureCreatorBase extends FixtureCreatorBase {
  /**
   * Common properties for both StudentDto and TeacherDto
   *
   * @description This is purely to satisfy the interface implementation requirements in TypeScript, as both StudentDto and TeacherDto
   * share the same properties and we need to access the type.
   */
  declare readonly firstName: string;
  declare readonly lastName: string;
  declare readonly email?: string;

  constructor(params?: {
    id?: UUID;
    firstName?: string;
    lastName?: string;
    email?: string;
  }) {
    super(params?.id);
    const person = this.generatePerson(params);

    this.exposeGettersAsValues({ ...person, id: params?.id });
  }
}

export class StudentFixtureCreator
  extends PersonFixtureCreatorBase
  implements StudentDto {}

export class TeacherFixtureCreator
  extends PersonFixtureCreatorBase
  implements TeacherDto {}

export class ClassFixtureCreator
  extends FixtureCreatorBase
  implements ClassDto
{
  /**
   * Class DTO declarations (TS-only). Runtime properties are defined in ctor.
   */
  declare readonly name: string;
  declare readonly description?: string;
  declare readonly degreeLevel?: string;

  /**
   * Private fields to hold the person properties
   */
  readonly #name: string;
  readonly #description?: string;
  readonly #degreeLevel?: string;

  constructor(params?: {
    id?: UUID;
    name?: string;
    description?: string;
    degreeLevel?: string;
  }) {
    super(params?.id);
    this.#name =
      params?.name ??
      `${this.randomInt(1, 5)}${String.fromCodePoint(
        65 + this.randomInt(0, 3)
      )}`;
    this.#description = params?.description;
    this.#degreeLevel = params?.degreeLevel;

    this.exposeGettersAsValues({
      name: this.#name,
      description: this.#description,
      degreeLevel: this.#degreeLevel,
    });
  }
}

export class CreateClassResponseFixtureCreator
  extends FixtureCreatorBase
  implements CreateClassResponseData
{
  /**
   * Response DTO for class creation (TS declarations only). Runtime values
   * are set with `defineEnumerableGetter` so they are visible to JSON/clone.
   */
  declare readonly name: string;
  declare readonly description?: string;
  declare readonly degreeLevel: string;

  /**
   * Private fields to hold the person properties
   */
  readonly #name: string;
  readonly #description?: string;
  readonly #degreeLevel: string;

  constructor(params?: {
    id?: UUID;
    name?: string;
    description?: string;
    degreeLevel?: string;
  }) {
    super(params?.id);
    this.#name =
      params?.name ??
      `${this.randomInt(1, 5)}${String.fromCodePoint(
        65 + this.randomInt(0, 3)
      )}`;
    this.#description = params?.description;
    this.#degreeLevel =
      params?.degreeLevel ??
      this.codeFromName(this.randomHumanWord({ minLen: 3, maxLen: 8 }), 3);

    this.exposeGettersAsValues({
      name: this.#name,
      description: this.#description,
      degreeLevel: this.#degreeLevel,
    });
  }
}

export class CreateTaskTemplateResponseFixtureCreator
  extends FixtureCreatorBase
  implements CreateTaskTemplateResponseData
{
  /**
   * CreateTaskTemplate response DTO (TS-only). Constructor exposes `task`.
   */
  declare readonly task: TaskViewDto;

  /**
   * Private fields to hold the person properties
   */
  readonly #task: TaskViewDto;

  constructor(params?: { id?: UUID; task?: TaskDto }) {
    super(params?.id);
    const task = params?.task ?? new TaskFixtureCreator();
    this.#task = {
      id: task.id,
      name: task.name,
      description: task.description,
    };

    this.exposeGettersAsValues({
      task: this.#task,
    });
  }
}

export class CreateDegreeResponseFixtureCreator
  extends FixtureCreatorBase
  implements CreateDegreeResponseData
{
  /**
   * CreateDegree response DTO (TS-only). Runtime degree exposed in ctor.
   */
  declare readonly degree: DegreeRefDto;

  /**
   * Private fields to hold the person properties
   */
  readonly #degree: DegreeRefDto;

  constructor(params?: { degree?: DegreeRefDto }) {
    super();
    this.#degree = params?.degree ?? new DegreeFixtureCreator("FIELD");

    this.exposeGettersAsValues({
      degree: this.#degree,
    });
  }
}

export class TaskTemplatesFetchFixtureCreator
  extends FixtureCreatorBase
  implements TaskTemplatesFetch
{
  /**
   * Fetch DTO wrapper for task templates (TS declarations only).
   */
  declare readonly taskTemplates: TaskTemplateDto[];
  declare readonly shortTemplatesList?: string[];

  /**
   * Private fields to hold the person properties
   */
  readonly #taskTemplates: TaskTemplateDto[];
  // readonly #shortTemplatesList?: string[];

  constructor(params?: {
    taskTemplates?: TaskTemplateDto[];
    shortTemplatesList?: string[];
  }) {
    super();
    this.#taskTemplates = params?.taskTemplates ?? [
      new TaskTemplateFixtureCreator(),
    ];

    this.exposeGettersAsValues({
      ...params,
      taskTemplates: this.#taskTemplates,
    });
  }
}
