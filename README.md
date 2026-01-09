<!--
  README for TeachBoard
-->

# TeachBoard — Frontend (React + TypeScript + Vite)

Bienvenue !

Cette application représente le frontend de TeachBoard, une interface pédagogique développée en React et TypeScript.

**Table des matières :**
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration & variables d'environnement](#configuration--variables-denvironnement)
- [Commandes utiles](#commandes-utiles)
- [Proxy API et backend](#proxy-api-et-backend)
- [Gestion des données réseau](#gestion-des-données-réseau)
- [Recettes rapides](#recettes-rapides)
- [Tests](#tests)
- [Contribuer](#contribuer)


## Aperçu

- Stack principale : React, TypeScript, Vite, TailwindCSS
- Proxy dev : le serveur Vite redirige /api vers l'API backend définie par [VITE_BACKEND_URL](vite.config.ts)
- Linting : ESLint

## Démo

> Démo en ligne temporairement non disponible.

Quand une démo sera publiée, elle sera référencée ici :

- Lien de la démo : **(démo non disponible pour le moment)**

Si vous souhaitez exécuter localement une instance « preview », suivez les étapes ci-dessous.

<!-- --- -->

## Prérequis

- Node 20
- npm 8+ ou yarn
- Vite 6+

<!-- --- -->

## Installation

Ouvrez un terminal PowerShell et exécutez les commandes suivantes :

```powershell
# Cloner ou Forkez le dépôt
git clone https://github.com/AdiDevClick/TeachBoard.git
cd TeachBoard/teacherboard/frontend

# Installer les dépendances
npm ci
```

Remarque : si vous préférez récupérer les packages sans fichier lock, vous pouvez remplacer `npm ci` par `npm install`.

Cette option est pratique pour le prototypage local. Toutefois, elle ne garantit pas le verrouillage des versions.

Notez : `npm install` n'applique pas le verrouillage strict des versions fourni par `package-lock.json`.

Si vous voulez garantir des versions identiques entre les environnements, conservez `npm ci`.

<!-- --- -->

## Configuration & variables d'environnement

Le projet utilise Vite et supporte des variables d'environnement préfixées par `VITE_`.

- Fichier d'exemple fourni : `.env.dev` (dans le repo). Exemple :

```env
VITE_BACKEND_URL=https://localhost:8443
```

Pour utiliser ces variables, copiez `.env.dev` vers `.env` :

```powershell
Copy-Item .env.dev .env -Force
```

Ou configurez la variable d'environnement dans PowerShell : 

```powershell
$env:VITE_BACKEND_URL = "https://localhost:8443"
```

<!-- --- -->

## Commandes utiles

 - Démarrer l'environnement de développement (HMR)

```powershell
npm run dev
```

Vite démarre généralement sur `http://localhost:5173` (ou un port libre). Ouvrez le navigateur pour voir l'application.
- Construire pour la production

```powershell
npm run build
```

- Prévisualiser le build (serveur statique)

```powershell
npm run preview
```

- Linter (ESLint)
```powershell
npm run lint
```

- Générer la configuration de lancement (script utile pendant le développement)

```powershell
npm run generate:launch
```

<!-- --- -->

## Proxy API et backend

Le serveur de développement Vite redirige toutes les requêtes `GET/POST/…` destinées à `/api/*`.

Il envoie ces requêtes vers l'URL définie dans la variable d'environnement [VITE_BACKEND_URL](vite.config.ts).

Ceci est utile si vous avez un backend local et que vous voulez rediriger les appels API vers votre machine.

Exemple dans `vite.config.ts` :

```ts
const backendUrl = process.env.VITE_BACKEND_URL || 'https://localhost:8443';
```

Si l'API backend est indisponible et que vous voulez développer côté frontend, vérifiez si des mocks sont présents.

Les mocks peuvent se trouver dans `/src/data` ou être intégrés dans certains hooks.

## Gestion des données réseau

Remarque : le projet utilise le proxy de développement Vite qui redirige les requêtes commençant par `/api/` vers l'API définie par la variable d'environnement `VITE_BACKEND_URL` (voir la section **Proxy API et backend**).

Ce projet centralise à la fois les **endpoints** et la **transformation des données** dans un seul fichier : [src/configs/api.endpoints.config.ts](src/configs/api.endpoints.config.ts).

- **But :** fournir un point unique pour déclarer les routes API (GET/POST) et la logique de *reshaping* des réponses afin d'homogénéiser la forme des données consommées par l'application.

- **Où :** le constant `API_ENDPOINTS` contient des groupes `GET` et `POST`. Chaque entrée peut définir :
  - `endpoint` / `endPoints` (URL ou factory),
  - `dataReshape: (payload, cachedDatas?, options?) => reshaped` — fonction qui normalise le payload serveur pour l'UI.

- **Reshape :** les fonctions `dataReshape` utilisent l'utilitaire [`ObjectReshape`](src/utils/ObjectReshape.ts) via `dataReshaper(...)` pour composer des transformations déclaratives (rename, assign, group, addToRoot, etc.).

  **Remarque :** le reshape offre de la flexibilité pour adapter les données à l'UI. Pour les transformations lourdes, privilégiez l'extraction dans des helpers testables et profilez avant d'optimiser. 

  **Cas fréquent :** si un composant attend `value` tandis que le payload fournit `name`, un reshape simple (rename) est la solution idéale pour maintenir compatibilité sans changer le backend ni le composant.

**Obligations lors d'une modification (checklist)** :
- [ ] Si vous modifiez ou ajoutez un `dataReshape`, **ajoutez un test de contrat** (dans `src/tests/units/endpoints/`) vérifiant le reshape attendu.
- [ ] Mettez à jour la documentation (README) et la checklist PR.
- [ ] Reformulez toute transformation complexe en helpers testables et importables depuis le reshape (le reshape doit rester essentiellement déclaratif).


  **Note :** le hook [`useFetch()`](src/hooks/database/fetches/useFetch.tsx) s'appuie sur `API_ENDPOINTS` et renvoie aux consommateurs le payload tel qu'il sort du `dataReshape` — assurez-vous que vos reshapes retournent la forme attendue par les composants ou services qui consomment ces données.

  **Où :** dans [src/hooks/database/fetches/useFetch.tsx](src/hooks/database/fetches/useFetch.tsx) la transformation est appliquée dans le callback `onSuccess` :

```ts
// 1 — Appel : on récupère le reshape depuis l'API_ENDPOINTS
// et on le passe à `useFetch` via `setFetchParams`.
setFetchParams({
  url: API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
  method: API_ENDPOINTS.POST.METHOD,
  dataReshapeFn: API_ENDPOINTS.POST.CREATE_CLASS.dataReshape,
});
```

```ts
// 2 — Réception du payload serveur
// Extrait (simplifié) de `useFetch.tsx`
const [fetchParams, setFetchParams] = useState(defaultStateParameters);

const queryParams = useQueryOnSubmit<ResponseInterface<TServerData>, E>([
  onSuccess: (response) => {
    // useFetch applique automatiquement la fonction fournie (dataReshapeFn)
    const cachingDatas = fetchParams.dataReshapeFn
      // Spécifier une fonction dans le fetchParams
      // va automatiquement la trigger à réception des données -
      // Veillez donc à utiliser l'`API_ENDPOINTS` pour centraliser les fonctions
      ? fetchParams.dataReshapeFn(response.data, rawCachedDatas, fetchParams.reshapeOptions)
      : response.data;

    // Expose la donnée reshaped aux consommateurs via `data`
    setViewData(cachingDatas as TViewData);

    // Met à jour le cache avec la structure reshaped (et / ou la nouvelle entrée pour un POST)
    queryClient.setQueryData(cachedFetchKey ?? [contentId, params.url], cachingDatas);

    // useFetch retourne `{ data: viewData }` — c'est donc `cachingDatas` qui sera lu par les composants
  }
]);
```

```ts
// 3 — Exemple de traitement du reshape via la fonction
dataReshape: (data: TasksFetch) =>
  dataReshaper(data)
    .assignSourceTo("items")
    .addToRoot({ groupTitle: "Tous" })
    .assign([["name", "value"]])
    .newShape(),
```

Exemple : RÈGLE OBLIGATOIRE

```ts
// GET : mettre en forme la réponse pour des selects
const shaped = API_ENDPOINTS.GET.CLASSES.dataReshape(rawPayload);

// POST : transformer la réponse et mettre à jour le cache
const updatedCache = API_ENDPOINTS.POST.CREATE_CLASS.dataReshape(createdItem, cachedDatas);
```

## Recettes rapides
Une collection de petits exemples pour aller droit au but.

- Rename d'une propriété (`name` → `value`) :
```ts
// dataReshape simple en utilisant dataReshaper
API_ENDPOINTS.GET.CLASSES.dataReshape = (payload) =>
  dataReshaper(payload).assign([['name', 'value']]).newShape();
```

- POST : recevoir le nouvel item et mettre à jour le cache :
```ts
// reshape appelé avec (createdItem, cachedDatas)
API_ENDPOINTS.POST.CREATE_CLASS.dataReshape = (createdItem, cachedDatas) =>
  reshapeItemToCachedData(createdItem, cachedDatas, createdItem.degreeLevel);
```

- `useFetch()` (extrait d'usage dans un composant) :
```ts
const { setFetchParams } = useFetch();
setFetchParams({ 
  url: API_ENDPOINTS.POST.CREATE_CLASS.endpoint, 
  method: API_ENDPOINTS.POST.METHOD, 
  dataReshapeFn: API_ENDPOINTS.POST.CREATE_CLASS.dataReshape 
});
```

- Stub fetch rapide (tests) :
```ts
stubFetchRoutes({ 
  getRoutes: 
  [
    [API_ENDPOINTS.GET.CLASSES.endpoint, [classSample]]
  ], 
  postRoutes: 
  [
    [API_ENDPOINTS.POST.CREATE_CLASS.endpoint, createdClass]
  ] 
});
```

- **Tests & contrats :** des tests de contrat vérifient les `dataReshape` dans [src/tests/units/endpoints/api-endpoints.config.contract.test.ts](src/tests/units/endpoints/api-endpoints.config.contract.test.ts) — ajoutez un test si vous modifiez un reshape.

- **Bonnes pratiques :**
  - Déclarez l'endpoint et la `dataReshape` ensemble pour garder la logique proche de la route.
  - Gardez `dataReshape` pure et testable (retourner une valeur, éviter effets de bord).
  - Utilisez `reshapeItemToCachedData(...)` (fourni dans le fichier) pour insérer proprement un nouvel item dans les données mises en cache.
  - **Déclarez une interface TypeScript** décrivant la forme de sortie du serveur quand c'est pertinent (ex. [`ClassesFetch`](src/api/types/routes/classes.types.ts)) et utilisez-la dans les contrôleurs et composants pour garantir le typage.
  - **Utilisez un schéma OpenAPI ou GraphQL** quand il est disponible pour générer ou valider automatiquement les interfaces/DTOs afin d'assurer la conformité entre le backend et l'UI.

### RÈGLE OBLIGATOIRE — rôle du fichier `API_ENDPOINTS`

> **Important :** `API_ENDPOINTS` doit uniquement contenir les *endpoints* (URLs/factories) et des fonctions pures de `dataReshape`. Toute logique plus avancée (orchestration, effets de bord, validation lourde) doit vivre dans un service dédié.

**Résumé (OBLIGATOIRE)** : Le fichier [src/configs/api.endpoints.config.ts](src/configs/api.endpoints.config.ts) sert uniquement à **déclarer les endpoints** (URLs / factories) et à **définir des fonctions pures de `dataReshape`** qui transforment/normalisent les données renvoyées par l'API pour l'UI. Point final.

Que **NE PAS** mettre dans `api.endpoints.config.ts` :
- Logique métier (calculs business, règles métier complexes).
- Effets de bord (modification de stores, appels réseau supplémentaires, IO, mutations globales).
- Validation lourde, orchestration ou injection de dépendances.

Si vous avez besoin d'un comportement plus avancé, créez un service dédié (p.ex. `src/services/…`) ou des helpers testables et réutilisables, puis appelez-les depuis l'endroit où ils sont nécessaires — **ne** les placez **pas** dans `API_ENDPOINTS`.

Obligations lors d'une modification (checklist pour les PR) :
- [ ] **Ajouter un test de contrat** (dans `src/tests/units/endpoints/`) pour tout `dataReshape` modifié/ajouté.
- [ ] **Mettre à jour la documentation** (README, `.github/copilot-instructions.md`) et la checklist PR.
- [ ] **Extraire la logique complexe** en helpers testables (le `dataReshape` doit rester essentiellement déclaratif).

Exemples de contrôle :
```ts
// OK: pure reshape
const shaped = API_ENDPOINTS.GET.CLASSES.dataReshape(rawPayload);

// NON OK: ne pas écrire dans le store ici
API_ENDPOINTS.POST.CREATE_CLASS.dataReshape = (data) => {
  store.set('lastCreated', data.id); // ❌ interdit
  return transformed;
}
```

- **Voir aussi :**
  - [src/configs/api.endpoints.config.ts](src/configs/api.endpoints.config.ts) — configuration centrale des endpoints + reshapers
  - [src/utils/ObjectReshape.ts](src/utils/ObjectReshape.ts) — primitives pour composer des reshapes
  - [src/tests/units/endpoints/api-endpoints.config.contract.test.ts](`src/tests/units/endpoints/api-endpoints.config.contract.test.ts`) — tests de contrat pour les reshapers

<!-- --- -->

## Structure du projet (aperçu rapide)

- `src/` — code source principal
  - `components/` — composants réutilisables
  - `pages/` — pages de l'application (login, home, evaluations, etc.)
  - `api/` — abstraction des appels API
  - `assets/` — images, icônes, styles
  - `hooks/` — hooks personnalisés
  - `routes/` — configuration des routes

<!-- --- -->

## Validation des props des composants

Pour éviter les usages invalides en développement, certains composants se protègent et retournent `null` si des props indispensables sont manquantes ou si des props interdites sont passées.

- Les helpers vivent dans [Components Config](src/configs/app-components.config.ts) : `labelledInputContainsInvalid`, `controllerPropsInvalid`, `listMapperContainsInvalid`, `loginButtonContainsInvalid`, `menuButtonContainsInvalid` et `debugLogs`.
- Pattern à placer en début de composant :

```ts
if (labelledInputContainsInvalid(props)) {
  debugLogs("LaballedInputForController");
  return null;
}
```

- Composants déjà protégés : `LaballedInputForController`, `withController`, `ListMapper`, `LoginButton`, `PrimaryMenuButton`, `SidebarCalendar` (absence d'events en contexte).
- Pour un nouveau composant, ajoutez un validateur dédié dans [Components Config](src/configs/app-components.config.ts), importez-le avec `debugLogs` et appliquez le garde en entrée pour garder le comportement homogène.

<!-- --- -->

## Tests

Le projet utilise Vitest pour les tests unitaires et d'intégration côté frontend.

Voici comment lancer et écrire des tests, ainsi que des bonnes pratiques spécifiques au projet.

### Commandes communes
- Lancer tous les tests en mode watch (développement)

```powershell
npm test
# ou
npm run test
```

- Lancer les tests une seule fois (exécution CI)

```powershell
npm run test -- run
```

- Lancer les tests E2E (Playwright)

```powershell
npm run test:e2e
```

### Environnement de test
- Nous utilisons `vitest-browser-react` pour les tests DOM.
- Pour des tests plus réalistes (E2E), nous utilisons Playwright en mode `chromium`.

### Bonnes pratiques pour tester les hooks

Pour des tests fiables des hooks, `getHookResults()` simplifie la consommation des fonctions exposées par un hook
et évite des problèmes courants (closures obsolètes, assertions instables).

En bref :
- Quand : utilisez-le lorsque vos tests accèdent à des fonctions renvoyées par un hook (ex. `openDialog`).
- Comment : appelez `getHookResults(hookOrResult)` (ou passez `hook` depuis `renderHook`) 
  pour obtenir `act` et les fonctions utiles.
- Patterns : voir ci-dessous **Pattern A** (recommandé) et **Pattern B** (déstructuration)
  pour des usages concrets et intégrés.
- Astuce TS : **Typez** `hook` (RenderHookResult) pour que le retour de `getHookResults()` soit correctement typé.

Voir aussi :
- [`useDialog()`](src/hooks/contexts/useDialog.ts)
- [`getHookResults()`](src/tests/test-utils/getHookResults.ts)



Pattern A — recommandé
```ts
import type { DialogContextType } from "@/api/contexts/types/context.types";
import type { RenderHookResult } from "vitest-browser-react";
import getHookResults from "@/tests/test-utils/getHookResults";
import { renderHook } from "vitest-browser-react";
import { AppTestWrapper } from "@/tests/test-utils/AppTestWrapper";

let hook: RenderHookResult<DialogContextType, unknown> | undefined;
const wrapperWithRouter = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
);

beforeEach(async () => {
  history.replaceState({ idx: 0 }, "", "/");
  hook = await renderHook(() => useDialog(), { wrapper: wrapperWithRouter });
});

test("openDialog updates isDialogOpen", async () => {
  // Compact: passer le RenderHookResult complet (hook) à getHookResults pour avoir act + fonctions
  const { act, isDialogOpen, openDialog, closeDialog } = getHookResults(hook!);

  expect(isDialogOpen("login")).toBe(false);
  await act(async () => openDialog(new MouseEvent("click"), "login"));
  expect(isDialogOpen("login")).toBe(true);
  await act(async () => closeDialog(new MouseEvent("click"), "login"));
  expect(isDialogOpen("login")).toBe(false);
});
```

Fichiers utiles :
- [`getHookResults()`](src/tests/test-utils/getHookResults.ts)
- [`useDialog()`](src/hooks/contexts/useDialog.ts)
- [`<AppTestWrapper/>`](src/tests/test-utils/AppTestWrapper.tsx)
- types: [`DialogContextType`](src/api/contexts/types/context.types.ts)
- context: [`DialogContext`](src/api/contexts/DialogContext.ts)

Pattern B — déstructuration du résultat
```ts
const { act, result } = hook!;
const { isDialogOpen, openDialog, closeDialog } = getHookResults(result);
await act(async () => openDialog(new MouseEvent("click"), "login"));
```

Explications & ASTUCES
 - [`getHookResults()`](src/tests/test-utils/getHookResults.ts) renvoie un proxy typé.

  Il encapsule les fonctions pour appeler la version la plus récente et ainsi éviter les closures obsolètes.

  - Assurez-vous de typer votre variable `hook` pour garantir le typage de l'objet retourné par `getHookResults()`.
    [`getHookResults()`](src/tests/test-utils/getHookResults.ts)
    (Voir l'exemple ci-dessus pour la déclaration TypeScript complète.)

Voyez [ce test de modale pour un exemple concret de l'implémentation.](src/tests/units/modal.test.tsx) 

### Exemple pratique (modales)
> **Note — Historique (modales)**
>
> Le composant `<Modal/>` gère l'historique du navigateur lorsque `isNavigationModal` est activé :
>
> - L'ouverture d'une modal ajoute `/{modalName}` à l'URL.
> - Revenir en arrière (history.back() / popstate) ferme la modal.
>
> **Astuce pour les tests :**
> - Initialisez l'historique avant d'ouvrir des modales.
> - Vérifiez ensuite que la navigation arrière (history.back() / popstate) ferme la modal.
>
> ```ts
> // initialiser l'historique pour éviter les erreurs en test
> history.replaceState({ idx: 0 }, '', '/');
> // ouvrir une modal puis revenir en arrière
> await act(async () => openDialog(null, 'login'));
> history.back(); // ou dispatchEvent(new PopStateEvent('popstate'))
> // assert modal fermée
> ```


### Fixtures de test

Cette section décrit les classes utilitaires utilisées pour générer des fixtures (DTOs et réponses d'API) destinées aux tests UI et unitaires. Les fixtures exposent des propriétés *own enumerable* afin d'être facilement spreadées, sérialisées et renvoyées depuis des stubs ou mocks.

**Principales classes (résumé rapide)**
- [`FixtureCreatorBase`](src/utils/FixtureCreator.ts)
  - Quoi : utilitaires de base (id, random, formatage).
  - Pourquoi : primitives partagées par toutes les fixtures.

- [`SkillFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : Skill DTO ({ name, code, type }).

- [`DegreeFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : `DegreeRefDto` (YEAR/FIELD/LEVEL, nom/code).

- [`TaskFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : Task DTO (name, description).

- [`TaskTemplateFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : TaskTemplate DTO (task + id).
  - Exemple : voir `src/tests/samples/class-creation-sample-datas.ts`.

- [`DiplomaConfigFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : config diplôme (degreeLevel, degreeYear, degreeField, skills).

- [`SkillsViewFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : vue modules/skills (mainSkill + subSkills).

- [`PersonFixtureCreatorBase`](src/utils/FixtureCreator.ts), [`StudentFixtureCreator`](src/utils/FixtureCreator.ts), [`TeacherFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : personnes (firstName, lastName, email).

- [`ClassFixtureCreator`](src/utils/FixtureCreator.ts)
  - Quoi : Class DTO (name, description, degreeLevel).
  - Exemple : `src/tests/samples/class-creation-sample-datas.ts`.

### Bonnes pratiques pour créer de nouvelles classes de fixtures personnalisées

La création de fixtures se doit d'être automatique et aléatoire.
On utilise `FixtureCreatorBase` pour générer des `id` UUIDs aléatoires et aussi servir d'interface pour les méthodes génératrices.

Pattern A — Création d'une classe(utilisation des méthodes)
```ts
export class SkillFixtureCreator extends FixtureCreatorBase implements SkillDto {
  // L'implémentation de SkillDto s'assure du typing après avoir créé l'objet
  
  // Spécifier ici un declare des propriétés à récupérer
  declare readonly name?: string;
  declare readonly code: string;
  declare readonly type?: SkillType;

  /**
   * Private fields to hold the code properties
   */
  readonly #code: string;

  constructor(params?: {
    id?: UUID;
    name?: string;
    code?: string;
    type?: SkillType;
  }) {
    super(params?.id);

    // On peut générer des values ou bien passer en params des values définies
    const fallbackName = this.randomHumanWord({ minLen: 5, maxLen: 12 });
    const nameForCode = params?.name ?? fallbackName;
    this.#code = params?.code ?? this.codeFromName(nameForCode, 3);

    // exposeGettersAsValues() crer automatiquement les propriétés ainsi que les getters pour l'accès
    this.exposeGettersAsValues({
      name: fallbackName,
      code: this.#code,
      type: params?.type,
    });
  }
}
```

Pattern B — Création d'une classe(utilisation d'autres classes)
```ts
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
  readonly #task: TaskViewDto;
  readonly #degreeConfiguration: DiplomaConfigDto;

  constructor(params?: {
    id?: UUID;
    name?: string;
    task?: TaskDto;
    degreeConfiguration?: DiplomaConfigDto;
    skills?: string[];
  }) {
    super(params?.id);

    // On peut générer des values directement en utilisant une classe spécifique
    const task = params?.task ?? new TaskFixtureCreator();
    this.#task = {
      id: task.id,
      name: task.name,
      description: task.description,
    };

    this.#degreeConfiguration =
      params?.degreeConfiguration ?? new DiplomaConfigFixtureCreator();

    this.exposeGettersAsValues({
      ...params,
      task: this.#task,
      degreeConfiguration: this.#degreeConfiguration,
    });
  }
}

```


Voici quelques exemples courts montrant comment instancier des fixtures et comment les valeurs passées via le constructeur sont exposées comme propriétés énumérables (grâce à [exposeGettersAsValues](src/utils/FixtureCreator.ts) dans [FixtureCreatorBase](src/utils/FixtureCreator.ts)).

### Créer des fixtures
Pattern A — Exemple pour une propriété précise(Task)
```ts
import { TaskFixtureCreator } from '@/utils/FixtureCreator';

const task = new TaskFixtureCreator({ name: 'Correction devoirs' });
console.log(task.id); // UUID exposé via un accessor enumerable
console.log(task.name); // 'Correction devoirs' — propriété propre et énumérable
console.log(JSON.stringify(task)); // sérialisable
```

Pattern B — Exemple imbriqué aléatoire(TaskTemplate contenant une Task)
```ts
import { TaskTemplateFixtureCreator } from '@/utils/FixtureCreator';

const template = new TaskTemplateFixtureCreator({ task: new TaskFixtureCreator() });
console.log(template.task.id, template.task.name); // l'objet `task` est exposé comme un plain object avec id + champs
```

Pattern C — Exemple généré
```ts
import { TaskTemplateFixtureCreator } from '@/utils/FixtureCreator';

const template = new TaskTemplateFixtureCreator();
console.log(template.task.id, template.task.name, template.degreeConfiguration); // l'objet `task` est exposé comme un plain object avec id + champs, degreeConfiguration est aussi accessible
```

**Note :** si `degreeConfiguration` n'est pas fourni au constructeur, [`TaskTemplateFixtureCreator`](src/utils/FixtureCreator.ts) génère automatiquement une [`DiplomaConfigFixtureCreator`](src/utils/FixtureCreator.ts) et l'expose via la propriété `degreeConfiguration`.

Ces patterns permettent de créer rapidement des DTOs testables et sérialisables — pratiques pour les stubs/mocks ou pour former des réponses d'API factices.

**Où trouver des fixtures prêtes à l'emploi :**
- `src/tests/samples/class-creation-sample-datas.ts` — données d'exemple réutilisables.
- `src/tests/samples/ui-fixtures/class-creation.ui.fixtures.ts` — fixtures UI + helpers.
- `src/tests/test-utils/vitest-browser.helpers.ts` — helpers pour stub fetch.

**Comment les utiliser (exemples)**
- Stub fetch (exemple rapide) :
```ts
import { ClassFixtureCreator } from '@/utils/FixtureCreator';
import { stubFetchRoutes } from '@/tests/test-utils/vitest-browser.helpers';

const classSample = new ClassFixtureCreator({ degreeLevel: '2A' });
// Retourne [ { data: [classSample] } ] pour les GET correspondant à '/api/classes'
stubFetchRoutes({ getRoutes: [["/api/classes", [classSample]]] });
```

### Mock de payloads pour des méthodes(routes) HTTP

Cet utils permet de créer un payload en fonction des url qui lui sont passées

- Signature :
  ```ts
  stubFetchRoutes({ getRoutes = [], postRoutes = [], defaultGetPayload = [] })
  ```
  - `getRoutes` / `postRoutes` : tableaux de tuples `[match, payload]`.
    - `match` est une chaîne ou un motif partiel qui sera testé avec `url.includes(match)`.
    - `payload` est la valeur renvoyée sous `{ data: payload }` par l'appel à `fetch().json()`.
  - `defaultGetPayload` : valeur retournée pour les `GET` non appariés (par défaut : `[]`).

- Comportement :
  - Si la requête est `POST`, `postRoutes` est vérifié en priorité ; si aucun `match` ne convient, le stub répond `{ data: {} }`.
  - Si la requête est `GET`, `getRoutes` est vérifié ; si aucun `match` ne convient, le stub répond `{ data: defaultGetPayload }`.
  - Les correspondances sont basées sur `url.includes(match)` pour une utilisation simple (pas besoin de RegExp).
  - Le helper utilise `vi.stubGlobal('fetch', ...)` pour remplacer `fetch` pendant le test.

Exemples :
```ts
// GET + POST simultanés
stubFetchRoutes({
  getRoutes: [["/api/skills", [skill1, skill2]]],
  postRoutes: [["/api/classes", createdClass]],
  defaultGetPayload: [],
});

// Usage minimal : GET unique
stubFetchRoutes({ getRoutes: [["/api/classes", [classSample]]] });
```

Astuce : Appelez `stubFetchRoutes()` *avant* le code qui déclenche les appels réseau (p.ex. juste avant l'action qui soumet un formulaire ou ouvre une page qui effectue des GET).

Détail : `buildFetchStubs` (générer des routes dynamiquement)

- But : `buildFetchStubs(spec, ctx)` transforme une spécification riche (utilisant des contrôleurs, fonctions et templates) en la forme plate attendue par `stubFetchRoutes` : `{ getRoutes: Array<[string, unknown]>, postRoutes: Array<[string, unknown]> }`.

- Paramètres :
  - `spec` : objet décrivant `getRoutes` et `postRoutes` où chaque route est de la forme `{ url: StubUrlSpec, response: StubResponseSpec }`.
    - `StubUrlSpec` peut être :
      - `string` — une URL ou un endpoint (sera utilisée telle quelle),
      - une fonction `(ctx) => string` — générer dynamiquement l'URL depuis le contexte,
      - ou `{ controller, mode? }` — dériver l'URL depuis un controller (utilise `controller.apiEndpoint`).
        - si `controller.apiEndpoint` est une fonction, `mode: 'prefix'` permet d'obtenir un préfixe d'endpoint utile pour matcher des URLs dynamiques (p.ex. `/api/templates/`).
  - `ctx` : contexte fourni aux `url`/`response` fonctions (ex. `{ controllers, sample, post, postResponse, vars }`).

- `response` peut être :
  - une valeur statique (objet, tableau, string...), ou
  - une fonction `(ctx) => unknown` qui retourne la valeur à exposer sous `{ data: ... }` par `stubFetchRoutes`.

- Comportement :
  - `buildFetchStubs` appelle `resolveUrl` et `resolveResponse` pour chaque route et retourne les paires `[url, payload]` prêtes à être passées à `stubFetchRoutes`.
  - Cela permet d'exprimer des routes réutilisables et dynamiques (voir `src/tests/samples/ui-fixtures/class-creation.ui.fixtures.ts`).

Exemple d'utilisation :
```ts
// Dans un fixture d'UI (useAppFixtures) :
const spec = buildFetchStubs(routeSpecs.createDiploma, {
  controllers,
  sample,
  post,
  postResponse: sample.diplomaCreated,
});
// spec est { getRoutes: [...], postRoutes: [...] }
stubFetchRoutes(spec);
```

Astuce : `buildFetchStubs` est pratique pour centraliser les routes d'un flow (createDiploma, createTaskTemplate, createClassStepOne, ...) et utiliser ces specs dans différents tests ou scénarios UI.


- Tester des hooks liés aux fixtures : utiliser [`getHookResults`](src/tests/test-utils/getHookResults.ts) + [`AppTestWrapper`](src/tests/test-utils/AppTestWrapper.tsx).

Fichiers utiles :
- [`FixtureCreatorBase`](src/utils/FixtureCreator.ts)
- [`exposeGettersAsValues`](src/utils/FixtureCreator.ts) — helper pour exposer les getters en propriétés propres et énumérables
- Classes de fixtures importantes : [`ClassFixtureCreator`](src/utils/FixtureCreator.ts), [`TaskFixtureCreator`](src/utils/FixtureCreator.ts), [`TaskTemplateFixtureCreator`](src/utils/FixtureCreator.ts), [`DiplomaConfigFixtureCreator`](src/utils/FixtureCreator.ts), [`SkillFixtureCreator`](src/utils/FixtureCreator.ts)
- Exemples & helpers : [`class-creation-sample-datas`](src/tests/samples/class-creation-sample-datas.ts), [`class-creation.ui.fixtures`](src/tests/samples/ui-fixtures/class-creation.ui.fixtures.ts)
- Helpers de test : [`stubFetchRoutes`](src/tests/test-utils/vitest-browser.helpers.ts) — helper pour stub fetch.

<!-- --- -->

## Modales (Le projet utilise un système centralisé de modales (Dialog))



Ce système est exposé via le [`<DialogProvider/>`](src/api/providers/DialogProvider.tsx).

Ce provider est le point central d'ouverture, de fermeture et de gestion des états des modales.

Il centralise la logique d'ouverture/fermeture et l'état des modales pour l'ensemble de l'application.

Le hook `useDialog()` expose les fonctions pour ouvrir, fermer et vérifier l'état des modales.

Voir : [`useDialog()`](src/hooks/contexts/useDialog.ts)
Ces fonctions permettent d'interagir avec le `DialogProvider` depuis vos composants.

Consultez `src/hooks/contexts/useDialog.ts` pour la documentation complète.


- Déclaration des modales :
  - Toutes les modales sont listées dans [`<AppModals/>`](src/pages/AllModals/AppModals.tsx).
  - L'objet de configuration réel utilisé pour créer les modales est la constante `modals`.
    Elle est définie dans [`src/pages/AllModals/AppModals.tsx`](src/pages/AllModals/AppModals.tsx).
    Pour un exemple, consultez `const modals = defineStrictModalsList([...])` dans ce fichier.

- Exemple simple d'objet `modals` (extrait et simplifié de `AppModals`):

```tsx
const modals = defineStrictModalsList([
  {
    modalName: "login",
    type: Modal,
    modalContent: LoginForm,
    contentProps: {
      inputControllers: inputLoginControllers,
      modalMode: true,
    },
  },
  {
    modalName: "signup",
    type: Modal,
    modalContent: Signup,
    contentProps: {
      inputControllers: inputSignupControllers,
      modalMode: true,
    },
  },
]) satisfies Parameters<typeof AppModals>[0]["modalsList"];
```

  - Pour consulter la liste complète et les props disponibles, ouvrez le composant suivant :
    [`<AppModals/>`](src/pages/AllModals/AppModals.tsx).
    Ce composant affiche les modales enregistrées ainsi que leurs propriétés associées.
  - Chaque modal possède :
    - une `modalName` (string unique),
    - un `type` (`Modal` ou `ModalWithSimpleAlert`),
    - un `modalContent` qui désigne le composant React à rendre à l'intérieur du modal.
  - Le type `ModalWithSimpleAlert` n'a pas besoin de `modalContent` mais devra contenir le `modalProps`
  - Veillez à utiliser [`defineStrictModalsList()`]
    (src/pages/AllModals/types/modals.types.ts) pour récupérer le typage de vos composants `modalContent`.
    Cela permet d'avoir un typage strict et d'éviter les erreurs de type durant l'implémentation.
  - Fichiers liés aux types / composants :
    - [`<Modal/>`](src/components/Modal/Modal.tsx)
    - [`<ModalWithSimpleAlert/>`](src/components/Modal/Modal.tsx)
    - types : [`modals.types.ts`](src/pages/AllModals/types/modals.types.ts)
  - Les noms valides sont typés dans [`src/configs/app.config.ts`](src/configs/app.config.ts) (`AppModalNames`).

### Ouvrir une modal :

  Pattern A — via un bouton (recommandé pour interactions UI) :

  ```tsx
  import { useDialog } from '@/hooks/contexts/useDialog';
  import { Button } from '@/components/ui/button';

  function MyComponent() {
    const { openDialog } = useDialog();

    const handleClick = (e: MouseEvent) => openDialog(e, 'login');

    // Note: `openDialog(e, 'login')` appellera `preventDefaultAndStopPropagation(e)` en interne.
    // Cette logique est gérée par le `DialogProvider`.
    // Cette protection empêche le comportement par défaut et stoppe la propagation de l'event.
    // Vous n'avez donc pas besoin d'appeler `e.preventDefault()`/`e.stopPropagation()` manuellement.

    return <Button onClick={handleClick}>Ouvrir la modal de login</Button>;
  }
  ```

  Pattern B — appel programmatique (contexte non-évènementiel) :

  ```ts
  const { openDialog } = useDialog();
  // depuis un service, hook, ou un effet où il n'y a pas d'Event DOM
  openDialog(null, 'login');
  ```

  Fichiers liés à l'exemple ci-dessus :
  - [`useDialog()`](src/hooks/contexts/useDialog.ts)
  - [`<Button/>`](src/components/ui/button.tsx)
  - context: [`DialogContext`](src/api/contexts/DialogContext.ts)

### Fermer une modal :

  Pattern A — via un handler / composant `DialogClose` :

  ```tsx
  import { useDialog } from '@/hooks/contexts/useDialog';
  import { DialogClose } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';

  function MyModalContent() {
    const { closeDialog } = useDialog();

    const handleClose = (e: React.MouseEvent) => closeDialog(e, 'login');

    // Note: `closeDialog(e, 'login')` appellera `preventDefaultAndStopPropagation(e)` en interne.
    // Cette logique est gérée par le `DialogProvider`.
    // Inutile de gérer manuellement `stopPropagation()` ou `preventDefault()` dans vos handlers.

    // Remarque : dans la plupart des cas, vous n'avez pas besoin d'appeler `closeDialog(e, 'login')` manuellement
    // si vous utilisez un bouton à l'intérieur du modal. `<DialogClose>` (ou le clic sur l'overlay / X)
    // déclenchera automatiquement le comportement de fermeture de Radix qui appelle `onOpenChange`.
    // Use `closeDialog()` when you need to run custom logic *and* trigger a programmatic close
    // (for example, call to service, analytics, or extra side-effects).

    return <DialogClose asChild><Button onClick={handleClose}>Fermer</Button></DialogClose>;
  }
  ```

  Minimal (no `closeDialog()` call required):

  ```tsx
  import { DialogClose } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';

  function MyModalContentSimple() {
    // No `useDialog()` or `closeDialog()` needed: DialogClose will close the modal
    return <DialogClose asChild><Button>Fermer</Button></DialogClose>;
  }
  ```

  Fermer une modal ciblée (pas forcément la modal actuellement affichée) :

  ```ts
  // Exemple : ouvrir deux modales (login puis signup), puis fermer 'signup' seulement
  const { openDialog, closeDialog } = useDialog();

  // Ouvrir deux modales (programmatique)
  openDialog(null, 'login');
  openDialog(null, 'signup');

  // Fermer la modal 'signup' sans toucher à 'login'
  closeDialog(null, 'signup');
  // Résultat : la modal 'login' reste ouverte
  ```

  - Si `closeDialog(e, id)` est appelé avec un ID explicite, ce modal est supprimé de l'ensemble des modales ouvertes.
    Exemple : `signup`.
    Cette suppression n'affecte pas les autres modales ouvertes.
    Elle s'applique même si ce n'est pas la modal visible au premier plan.
  - Si `closeDialog()` est appelé sans ID, la fonction fermera la modal la plus récente.
    Concrètement, elle supprime le dernier élément du `Set` interne des modales ouvertes.
  - Ce comportement est implémenté dans [`DialogProvider`](src/api/providers/DialogProvider.tsx).
    `setOpenDialogs` stocke un `Set` d'IDs.
    `closeDialog` supprime l'ID cible.
    Si aucun ID n'est fourni, la dernière entrée du `Set` est supprimée.
    Cette implémentation permet de gérer plusieurs modales superposées tout en conservant l'ordre d'ouverture.

  Pattern B — appel programmatique (fermeture depuis un hook/service) :

  ```ts
  const { closeDialog } = useDialog();
  // depuis un service, hook, ou un effet où il n'y a pas d'Event DOM
  closeDialog(null, 'login');
  ```

  Fichiers liés à l'exemple ci-dessus :
  - [`closeDialog()`](src/hooks/contexts/useDialog.ts)
  - [`<DialogClose/>`](src/components/ui/dialog.tsx)
  - [`<Button/>`](src/components/ui/button.tsx)

### Autres méthodes utiles :
  - [`closeAllDialogs()`](src/api/providers/DialogProvider.tsx) — ferme toutes les modales ouvertes

  - [`isDialogOpen()`](src/api/providers/DialogProvider.tsx)(`'login'`) — vérifie si une modal est ouverte

  - [`onOpenChange()`](src/components/Modal/Modal.tsx)(modalName) — callback pour gérer le changement d'état

### À savoir :
  - Le composant [`<Modal/>`](src/components/Modal/Modal.tsx) gère l'historique du navigateur (pushState/replaceState).
    L'ouverture d'une modal peut ajouter `/{modalName}` à l'URL.
    Si vous avez besoin de détails sur la gestion de l'historique, consultez la section "Note — Historique" ci-dessus.
    Pour des astuces de tests liées à l'historique, référez-vous à la même section.

  - La meilleure pratique : appeler [`openDialog()`](src/hooks/contexts/useDialog.ts) depuis un handler d'événement.
    Ex : `onClick`.

  Bon à savoir :
  - [`openDialog()`](src/hooks/contexts/useDialog.ts) accepte un `Event` ou `null`.
  - [`closeDialog()`](src/hooks/contexts/useDialog.ts) accepte un `Event` ou `null`.
    Utilisez `null` pour des appels programmatiques afin d'éviter de fournir un `Event`.

  - Le composant [`<Modal/>`](src/components/Modal/Modal.tsx) lie le `Dialog` de Radix au `DialogProvider`.
    Il effectue cette liaison via la prop `open` pour synchroniser l'état du modal.
    Il déclenche le callback `onOpenChange` pour signaler un changement d'état.
    Exemple : suite à `<DialogClose/>` ou clic sur l'overlay.
    Le provider, via cet `onOpenChange`, retire la modal de l'ensemble des modales ouvertes.
    Par conséquent, appeler `closeDialog(e, 'login')` n'est généralement pas nécessaire.
    Cela s'applique pour les fermetures initiées par l'UI.
    Toutefois, utilisez `closeDialog()` pour un contrôle programmatique et pour déclencher des effets secondaires.

  - Si une modal est configurée avec `isNavigationModal: true`,
    l’action d’ouverture ajoute `/{modalName}` à l’historique du navigateur.
    (La valeur par défaut dépend des `modalProps`.)
    Le composant [`<Modal/>`](src/components/Modal/Modal.tsx) gère automatiquement ce comportement.
    Revenir en arrière fermera la modal.

  - Utilisez [`onOpenChange()`](src/components/Modal/Modal.tsx) si vous devez réagir au cycle d’ouverture/fermeture.
    Cette fonction reçoit le nom de la modal en argument.
  
## Utils pratiques
Quelques helpers réutilisables stockés dans [`src/utils/utils.ts`](/src/utils/utils.ts) :

- `preventDefaultAndStopPropagation(e)` — protège vos handlers d’événement : 
  - Il appelle `preventDefault()` et `stopPropagation()` si un `Event` est fourni. 
  - Utile dans les callbacks qui peuvent être appelés tant depuis l’UI que de façon programmatique.

```ts
import { preventDefaultAndStopPropagation } from '@/utils/utils';

function handleClick(e?: MouseEvent) {
  // Protège contre les comportements par défaut et l’event bubbling
  preventDefaultAndStopPropagation(e);
  // logique métier
}
```

- `wait(duration[, message])` — une promesse pour ajouter un délai (utile en tests ou pour laisser l’UI se stabiliser).

```ts
import { wait } from '@/utils/utils';
await wait(150);
```

- `handleModalOpening({ e, dialogFns, modalName })` — helper pour fermer toutes les modales ouvertes.
  Il ouvre ensuite une nouvelle modal proprement.
  Il prend un objet `dialogFns: { closeAllDialogs, openDialog }`.

```ts
import { handleModalOpening } from '@/utils/utils';

handleModalOpening({
  e,
  dialogFns: { closeAllDialogs, openDialog },
  modalName: 'signup',
});
```

- `dialogFns` — objet contenant `closeAllDialogs` et `openDialog`.  
  - Ce pattern est utilisé par exemple dans [`LoginForm`](src/components/LoginForms/LoginForm.tsx) :  
    - On passe `dialogFns: { closeAllDialogs, openDialog }` au helper `handleModalOpening`.

- `dataReshape` / `dataReshapeFn` — fonctions de *reshaping* utilisées pour transformer le payload renvoyé par l'API avant de le stocker ou l'exposer au reste de l'application. Elles sont définies dans `API_ENDPOINTS` (ex. `API_ENDPOINTS.GET.CLASSES.dataReshape`, `API_ENDPOINTS.POST.CREATE_CLASS.dataReshape`) et sont consommées comme `dataReshapeFn` dans les contrôleurs et flows (ex. `useCommandHandler`). Voir [`src/configs/api.endpoints.config.ts`](src/configs/api.endpoints.config.ts) et les tests `src/tests/units/endpoints/api-endpoints.config.contract.test.ts`.

- `FixtureCreatorBase` / classes de fixtures — utilitaires pour générer des DTOs et réponses d'API factices (`ClassFixtureCreator`, `TaskFixtureCreator`, `TaskTemplateFixtureCreator`, etc.). Utilisez-les pour créer des objets testables, sérialisables et réutilisables dans vos tests ou stubs (ex. `src/tests/samples/*`). Voir : [`src/utils/FixtureCreator.ts`](src/utils/FixtureCreator.ts).

Ces helpers centralisent des comportements courants et évitent la duplication de logique.

Exemple : s’assurer qu’une seule modal est ouverte à la fois.

Voir `src/utils/utils.ts` pour la liste complète et les types.

  
### Noms de modales disponibles

Les noms de modales supportés par l'application se trouvent dans :
[`src/configs/app.config.ts`](src/configs/app.config.ts)
Le type associé est `AppModalNames`.

Voici la liste actuelle :

- `login`
- `apple-login`
- `signup`
- `pw-recovery`
- `pw-recovery-email-sent`
- `class-creation`

> Remarque : la liste ci-dessus vient du typage.
> Certaines modales peuvent ne pas être déclarées dans `<AppModals/>`.
> Consultez [`<AppModals/>`](src/pages/AllModals/AppModals.tsx) pour visualiser la liste appliquée actuellement.


## Contribuer

Merci pour votre intérêt ! Quelques guidelines :

- Branchez-vous sur une branche dédiée au feature ou bugfix : `feature/...`, `fix/...`.
- Ouvrez une Pull Request avec description détaillée et captures d'écran quand nécessaire.
- Respectez le style du projet (ESLint, TS strict).

---

## Débogage & Ressources utiles

- Logs navigateur & console serveur (backend proxy)
- Vérifiez la variable [VITE_BACKEND_URL](vite.config.ts) si les requêtes API échouent
- Si HMR ne se met pas à jour, redémarrez `npm run dev` et videz le cache du navigateur

---

## Licence & Contact

Ce repo appartient à AdiDevClick / TeachBoard.

Pour des questions, utilisez les Issues GitHub ou contactez les mainteneurs du projet.

---

Astuce : si vous souhaitez que je prépare aussi un guide de déploiement (Vercel / Netlify / GitHub Pages)
ou un modèle de page Demo « statique », dites-le et je l’ajoute !
