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
- [Configuration des logs](#configuration-des-logs)
- [Commandes utiles](#commandes-utiles)
- [Proxy API et backend](#proxy-api-et-backend)
- [Gestion des données réseau](#gestion-des-données-réseau)
- [Structure du projet (aperçu rapide)](#structure-du-projet-apercu-rapide)
- [App Stores](#app-stores)
  - [Structure](#app-stores-structure)
  - [Liste des stores existants](#app-stores-liste-des-stores)
  - [Comment construire un store (How To Build)](#app-stores-comment-construire-un-store)
    - [Types](#app-stores-types)
    - [Store](#app-stores-store)
    - [Extensions Zustand](#app-stores-extensions-zustand)
- [Types communs & validation](#types-communs--validation)
  - [UUID](#uuid)
  - [Email](#email)
  - [Year range](#year-range)
  - [OffsetDateTime](#offsetdatetime)
  - [SessionToken](#sessiontoken)
- [Composants — Catalogue](#composants--catalogue)
  - [Buttons](#buttons)
  - [Inputs](#inputs)
  - [Selects](#selects)
  - [Modal](#modal)
  - [Form components (LoginForm)](#form-components-loginform)
  - [Lists & Data Table](#lists--data-table)
  - [Charts](#charts)
  - [Layout (Header / Sidebar / Footer)](#layout-header--sidebar--footer)
  - [Icons](#icons)
- [CSS & Styles](#css--styles)
  - [Structure des fichiers CSS](#structure-des-fichiers-css)
  - [Mixins](#mixins)
  - [Classes utilitaires & composants CSS](#classes-utilitaires--composants-css)
- [Architecture & conventions — MVC (Controllers) et HOCs](#architecture-mvc-hocs)
  - [Controllers (pattern MVC)](#controllers-pattern-mvc)
  - [Structure des dossiers pour une feature (pattern MVC)](#structure-des-dossiers-pour-une-feature-pattern-mvc)
  - [Construction d'un controller — Conventions obligatoires](#construction-dun-controller---conventions-obligatoires)
  - [HOCs — utilité & exemples](#hocs-utilite-exemples)
    - [Liste des HOCs (usage dans des vues)](#liste-des-hocs-usage-dans-des-vues)
      - [withTitledCard](#withtitledcard)
      - [withController](#withcontroller)
      - [withListMapper](#withlistmapper)
      - [withComboBoxCommands](#withcomboboxcommands)
      - [withIconItem](#withiconitem)
- [Validation des props des composants](#validation-des-props-des-composants)
- [Recettes rapides](#recettes-rapides)
- [Utils pratiques](#utils-pratiques)
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

<a id="structure-du-projet-apercu-rapide"></a>

## Structure du projet (aperçu rapide)

- `src/` — code source principal
  - `components/` — composants réutilisables
  - `pages/` — pages de l'application (login, home, evaluations, etc.)
  - `api/` — abstraction des appels API
  - `assets/` — images, icônes, styles
  - `hooks/` — hooks personnalisés
  - `routes/` — configuration des routes

<!-- --- -->

<a id="app-stores"></a>

## App Stores

Le projet utilise **Zustand**.
Cette section décrit les **conventions** et la **structure** attendues pour les stores d'application présents.

<a id="app-stores-structure"></a>

### Structure

- `src/api/store/` — stores d'application
  - `types/` — définitions TypeScript pour les stores

<a id="app-stores-liste-des-stores"></a>

### Liste des stores existants

- [`AppStore.ts`](src/api/store/AppStore.ts) — store combiné / point d'export principal
- [`AuthMemoryStore.ts`](src/api/store/AuthMemoryStore.ts) — store mémoire pour l'authentification
- [`DiplomaCreationStore.ts`](src/api/store/DiplomaCreationStore.ts) — store pour la création de diplômes
- [`EvaluationStepsCreationStore.ts`](src/api/store/EvaluationStepsCreationStore.ts) — store pour la création d'évaluation
- [`selectors.ts`](src/api/store/selectors.ts) — selecteurs / helpers pour interroger les stores

<a id="app-stores-comment-construire-un-store"></a>

### How to build

- Voir la section `Types` ci-dessous pour les conventions de fichiers de types (`<store-name>.types.ts`) et l'exemple. 
- En complément : créez le fichier d'implémentation du store `src/api/store/<StoreName>.ts` et exposez/implémentez les actions mentionnées dans le fichier de types.

<a id="app-stores-extensions-zustand"></a>

#### Extensions Zustand

- **Extensions utilisées :**
  - `devtools` — intégration aux Redux DevTools, utile pour le debugging et le time-travel.

    Exemple :
    ```ts
    import { create } from 'zustand';
    import { devtools } from 'zustand/middleware';

    export const useAppStore = create(
      devtools((set) => ({
        count: 0,
        inc: () => set((s) => ({ ...s, count: s.count + 1 })),
      }), { name: 'TeachBoardStore' })
    );
    ```

  - `immer` — permet un style mutatif pour les mises à jour d'état tout en conservant l'immuabilité.

    Exemple — Avant / Après :

    Avant (sans `immer`) — pattern immuable explicite :
    ```ts
    import { create } from 'zustand';

    export const useStore = create((set) => ({
      items: [],
      add: (item) => set((s) => ({ ...s, items: [...s.items, item] })),
    }));
    ```

    Après (avec `immer`) — syntaxe mutative simplifiée :
    ```ts
    import { create } from 'zustand';
    import { immer } from 'zustand/middleware/immer';

    export const useStore = create(
      immer((set) => ({
        items: [],
        add: (item) => set((draft) => { draft.items.push(item); }),
      }))
    );
    ```

    Note : `immer` réduit le boilerplate lié aux copies (spread) et rend les mises à jour plus lisibles tout en conservant l'immuabilité sous-jacente.

  - `persist` — persistance du store (localStorage/sessionStorage) pour conserver l'état entre sessions.

    Exemple :
    ```ts
    import { create } from 'zustand';
    import { persist } from 'zustand/middleware';

    export const useStore = create(
      persist((set) => ({
        // Tous les setters du store seront persistés
        theme: 'light',
        setTheme: (t) => set({ theme: t }),
      }), { name: 'teachboard-storage' })
    );
    ```

  - `combine` — helper qui facilite la composition d'un `state` initial typé avec les `actions` du store.

    Exemple :
    ```ts
    import { create } from 'zustand';
    import { combine } from 'zustand/middleware';

    const DEFAULT = { count: 0 };
    export const useStore = create(combine(DEFAULT, (set) => ({
      inc: () => set((s) => ({ ...s, count: s.count + 1 })),
    })));
    ```

- **Exemple combiné (pattern courant dans ce repo)** :

```ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { combine } from 'zustand/middleware';

const DEFAULT_VALUES = { /* ... */ } as const;

export const useEvaluationStepsCreationStore = create(
  devtools(
    immer(
      persist(
        combine(DEFAULT_VALUES, (set, get) => ({
          clear: () => set(() => ({ ...DEFAULT_VALUES })),
          // actions...
        })),
        { name: 'steps-creation-store' }
      )
    ),
    { name: 'StepsCreationStore' }
  )
);
```

> Astuce : adaptez l'ordre et les options selon vos besoins (persist généralement autour du state interne, devtools en extérieur pour capturer l'historique).

<a id="app-stores-store"></a>

#### Store

- Conventions :
  1. **DEFAULT_VALUES — State only**
     - Déclarez `const DEFAULT_VALUES: <StoreName>State = { ... }` (toujours typer avec l'interface *state* uniquement).
     - Préférez des instances vides pour les collections (ex. `new UniqueSet()`) plutôt que `null` quand cela a du sens.

  2. **Créer le store avec `combine(DEFAULT_VALUES, ...)`**
     - Ex : `combine(DEFAULT_VALUES, (set, get) => { ... })`.
     - Utilisez `DEFAULT_VALUES` pour garantir une réinitialisation cohérente via une action `clear` :
       `clear: () => set(() => ({ ...DEFAULT_VALUES }))`.

  3. **Pattern recommandé — objet `ACTIONS` explicite**
     - À l'intérieur de `combine(...)`, créez `const ACTIONS: <StoreName>Actions = { ... }` et implémentez tous les setters / getters dedans.
     - Retournez `ACTIONS` à la fin de `combine`.
     - Avantages : appels internes sûrs (`ACTIONS.setX(...)`), pas de binding `this` fragile, meilleure lisibilité et testabilité.

     Exemple court :
     ```ts
     const ACTIONS: StepsCreationActions = {
       clear() { set(() => ({ ...DEFAULT_VALUES })); },
       setStudents(students) { /* ... */ },
       setSelectedClass(c) { ACTIONS.setStudents(c.students); }
     };
     return ACTIONS;
     ```

  4. **NE PAS UTILISER `this`**
     - Ne pas utiliser `this` dans les setters (risque si la méthode est extraite ou passée en callback).
     - Si vous voulez uniquement l'auto‑complétion, vous pouvez typer `get` : `(set, get: () => <StoreName>Store) => ({ ... })` et appeler `get().setX(...)`, mais `ACTIONS` reste la solution recommandée.

- Raison : ce pattern rend l'implémentation prévisible (single source of truth pour les valeurs par défaut), stable (pas de binding `this`) et testable (on peut stuber/spyer `ACTIONS` dans les tests) et il évite de typer manuellement les setters 


Exemple (extrait simplifié de `StepsCreationStore`) :

```ts
// Type the DEFAULT values with the *state* interface
const DEFAULT_VALUES: StepsCreationState = {
  id: null,
  description: null,
  students: new UniqueSet(),
  tasks: new UniqueSet(),
  evaluations: null,
  diplomaName: null,
  className: null,
  selectedClass: null,
};

export const useEvaluationStepsCreationStore = create(
  devtools(
    immer(
      combine(DEFAULT_VALUES, (set, get) => {
        // Use a local ACTIONS object so actions can call each other safely
        const ACTIONS = {
          clear: () => set(() => ({ ...DEFAULT_VALUES })),
          setSelectedClass(selectedClass: ClassSummaryDto) {
            set((state) => {
              state.selectedClass = selectedClass;
              state.id = selectedClass.id || null;
              // ...other state mapping
            });

            // Call other actions via ACTIONS (stable & testable)
            ACTIONS.setStudents(selectedClass.students);
            ACTIONS.setClassTasks(selectedClass.templates);
          },
          // ...other actions
        };

        return ACTIONS;
      })
    )
  )
);
```


<a id="app-stores-types"></a>

#### Types

- Emplacement : `src/api/store/types/`.
- Convention :
  - Créez un fichier de types `<store-name>.types.ts` pour chaque store.
  - Exportez :
    - `interface <StoreName>State` (seulement l'état, *sans* les setters),

> Astuce : La création d'une `interface <StoreName>Action` n'est pas nécessaire (`Combine` gère automatiquement le typage des setters/getters).

Exemple de fichier de types (convention recommandée) :
```ts
// src/api/store/types/steps-creation-store.types.ts
import type { ClassSummaryDto } from '@/api/routes/classes.types.ts';

export interface StepsCreationState {
  // UUID existe et est un type commun de l'app
  id: UUID | null;
  description: string | null;
  students: UniqueSet<StudentWithPresence> | null;
  tasks: UniqueSet<Task> | null;
  evaluations: unknown | null;
  diplomaName: string | null;
  className: string | null;
  // ClassSummaryDto existe déjà dans l'app
  selectedClass: ClassSummaryDto | null;
}

```

**Checklist rapide pour une PR :**
- [ ]  Ajouter / mettre à jour `src/api/store/<StoreName>.ts` et `src/api/store/types/<store-name>.types.ts`.
- [ ]  Déclarer `const DEFAULT_VALUES` et typer les valeurs par défaut avec `<StoreName>State` (ex. `const DEFAULT_VALUES: StepsCreationState = {...}`).
- [ ]  Déclarer `const ACTIONS = { ... }` dans `combine(...)` pour appeler des actions entre elles.
- [ ]  Réutiliser les types existants quand cela est pertinent (p.ex. `ClassSummaryDto`).
- [ ]  Mettre à jour la documentation (README) et vérifier la TOC.


## Types communs & validation

Cette section présente les **types communs** fournis par le projet (branded types + schémas Zod) et des exemples d'utilisation pour la validation runtime et le typage TypeScript.

**Fichiers utiles :**
- [`src/api/types/openapi/common.types.ts`](src/api/types/openapi/common.types.ts) — définitions et `Zod` schemas exportés (UUID, Email, YearRange, OffsetDateTime, SessionToken).

### Pourquoi utiliser ces types ?
- **Clarté** : un `Email`/`UUID` n'est pas un simple `string` — le branded type le rend explicite.
- **Sécurité** : validez aux frontières (API / forms) avec `Zod` et transformez en type brandé avant usage.
- **Interopérabilité** : réutilisez les mêmes schémas dans controllers, forms et tests.

### Exemples d'utilisation

- Valider une adresse e-mail (et obtenir le type `Email`) :

```ts
import { EMAIL_SCHEMA } from '@/api/types/openapi/common.types.ts';

const email = EMAIL_SCHEMA.parse('user@example.com'); // email : Email
```

- Valider un UUID :

```ts
import { UUID_SCHEMA } from '@/api/types/openapi/common.types.ts';

// id : UUID
const id = UUID_SCHEMA.parse('123e4567-e89b-12d3-a456-426614174000'); 
```

- Utiliser le `SessionToken` dans une réponse API :

```ts
import { SESSION_TOKEN_SCHEMA } from '@/api/types/openapi/common.types.ts';

const LoginResponse = z.object({
  token: SESSION_TOKEN_SCHEMA,
  user: UserSchema,
});

const data = LoginResponse.parse(await res.json());
// data.token est typé `SessionToken` et validé au runtime
```

- Intégrer les schémas dans `react-hook-form` via `zodResolver` :

```ts
const form = useForm({
  resolver: zodResolver(MyFormSchema),
});
```

#### UUID

- **But :** représenter un identifiant de ressource (UUID) comme un type *brandé* et le valider au runtime.

```ts
import { UUID_SCHEMA } from '@/api/types/openapi/common.types.ts';

// Zod fournit .uuid(), le schéma du projet exporte UUID_SCHEMA (brandé)
const id = UUID_SCHEMA.parse('123e4567-e89b-12d3-a456-426614174000'); // id : UUID
```

> Astuce : utilisez `UUID_SCHEMA` directement pour valider la réponse d'une API, ou `.uuid()` pour validations simples.

#### Email

- **But :** valider un e-mail et obtenir le type `Email` garantissant le format.

```ts
import { EMAIL_SCHEMA } from '@/api/types/openapi/common.types.ts';

const email = EMAIL_SCHEMA.parse('user@example.com'); // email : Email
```

#### Year range

- **But :** valider la chaîne `"YYYY-YYYY"` (ex: "2023-2024") et obtenir un type dédié `YearRange`.

```ts
import { YEAR_RANGE_SCHEMA } from '@/api/types/openapi/common.types.ts';

const schoolYear = YEAR_RANGE_SCHEMA.parse('2023-2024'); // schoolYear : YearRange
```

#### OffsetDateTime

- **But :** représenter une date/heure ISO-8601 et bénéficier d'un schéma Zod (`z.date`/`z.string().datetime()` selon l'usage).

```ts
import { OFFSET_DATE_TIME_SCHEMA } from '@/api/types/openapi/common.types.ts';

const ts = OFFSET_DATE_TIME_SCHEMA.parse('2023-10-05T14:48:00.000Z'); // ts : OffsetDateTime
```

#### SessionToken

- **But :** typer et valider le token de session renvoyé par le backend (format hex ou pattern du serveur).

```ts
import { SESSION_TOKEN_SCHEMA } from '@/api/types/openapi/common.types.ts';

const token = SESSION_TOKEN_SCHEMA.parse('2682dc7e6b3b0d08547106ebac94cee8'); // token : SessionToken
```

### Bonnes pratiques
- **Toujours** valider les données externes avant de les `as`-caster en branded types ; préférez les transformations (`.transform()`) ou des assertions (`assertIsUUID`).
- Placez les schémas dans `src/api/types/...` ou `src/models/...` selon le rôle (types purs vs logique métier).
- Ajoutez des tests unitaires (Vitest) pour couvrir les cas valides et invalides des schémas.

---

<a id="css--styles"></a>

## CSS & Styles

Cette section documente les conventions CSS du projet, la structure des fichiers, les mixins réutilisables et les classes spécifiques incluses dans le dépôt. Chaque entrée contient un **rôle**, un **exemple d'utilisation** et des **fichiers utiles**.

<a id="structure-des-fichiers-css"></a>

### Structure des fichiers CSS

- `src/assets/css/` — emplacement pour les styles globaux, mixins et composants CSS.
  - `_mixins.scss` — mixins réutilisables (helpers Sass).
  - `Slider.scss` — styles pour le composant slider.

**Exemple :** importer les mixins dans un fichier SCSS:

```scss
@use 'mixins' as *; // En haut du fichier
```

**Fichiers utiles :**
- [_mixins.scss](src/assets/css/_mixins.scss) — collection de mixins (implémentation).
- [Slider.scss](src/assets/css/Silder.scss) — styles du composant `<Slider/>`.

<a id="mixins"></a>

### Mixins — Liste

- [`@mixin property`](src/assets/css/_mixins.scss) — Définit une propriété CSS via `@property` pour exposer des variables typées (syntax, inherits, initial-value).
  - Exemple d'utilisation :
  ```scss
  @include property(slider-progress, percentage, true, 25%);

  // Example: 
  .myclass {
    width: var(--slider-progress); // Commencera à 25%
  }
  ```

- [`@mixin apply-width-crop`](src/assets/css/_mixins.scss) — Définit une largeur responsive limitée par un crop margin (utile pour containers avec un max-width et un padding latéral).
  - Exemple d'utilisation :
  ```scss
  @include apply-width-crop(1200px, 16px);
  ```

- [`@mixin apply-repeated-linear-gradient-for-slider`](src/assets/css/_mixins.scss) — Génère un fond composé de dégradés linéaires répétés pour représenter des graduations/ticks sur un slider. Accepte angle, variable (progress), liste de ticks, épaisseur et couleur.
  - Exemple d'utilisation :
  ```scss
  // Example:
  .myclass {
    @include apply-repeated-linear-gradient-for-slider(90deg, '--slider-progress', 0 25 50, 1px, #fff); 
    // Cela va appliquer 3 linear-gradient tous les 25% dans un seul background
  }
  
  ```

<a id="classes-utilitaires--composants-css"></a>

### Classes utilitaires & composants CSS

- **`.four-steps-slider`** - [Slider.scss](src/assets/css/Slider.scss)

  - Rôle : fournir un visuel de progression en quatre étapes avec marqueurs de tick et plage de couleur dynamique.
  - Propriétés disponibles : 
    - `--slider-progress` - Permet de sectionner le slider en plusieures sections (n'a pas besoin d'être modifié)
    - `--slider-rangeColor` - Définit la couleur du range (peut être utilisé via Houdini API)

  - Exemple de markup :
  ```tsx
  <Slider
    step={25}
    value={value}
    onValueChange={setValue}
    className="four-steps-slider"
    style={
      {
        "--slider-rangeColor": rangeColor(),
      } as CSSProperties
    }
  />
  ```
---

<h2 id="architecture-mvc-hocs"/>

## Architecture & conventions — MVC (Controllers) et HOCs

Cette section décrit les **conventions d'architecture** utilisées dans le projet pour séparer la logique métier (Controllers) et la présentation (Composants), ainsi que l'usage des **Higher-Order Components (HOCs)** pour les petits patterns réutilisables de layout ou d'intégration.

### Controllers (pattern MVC)
- **Rôle:** orchestrer le flux (appel d'API via `useFetch`/`useCommandHandler`, gestion du formulaire, manipulation du cache React Query, callbacks, side-effects). Ne doit pas rendre des éléments purement présentiels complexes — déléguez le rendu aux composants enfants.
- **Bonnes pratiques :**
  - Garder la logique (fetching, transformation, orchestration) dans le controller.
  - Utiliser des hooks partagés (`useCommandHandler`, `useFetch`, etc.) pour standardiser les interactions réseau.
    - `useCommandHandler` expose déjà toute la logique de fetching, opening, selection etc... que demande un formulaire et est donc un hook très pratique à prioriser.
  - Exposer des props simples et typés au composant présentational (ex. `ClassCreationController` expose `form` et handlers, et rend `<ControlledInputList/>`, `<PopoverFieldWithCommands/>` etc.).
  - Tester les controllers via des tests unitaires simulant les hooks et le store (Vitest + stubs).

<a id="structure-des-dossiers-pour-une-feature-pattern-mvc"></a>

### Structure des dossiers pour une feature (pattern MVC)
Voici la convention de structure (format demandé : `dossier > controller/types/functions/le-composant`) :

- `src/components/<Feature>/` — dossier de la feature
  - `controller/` — orchestration (fetchs, soumissions, cache, side-effects) — voir [Controllers (pattern MVC)](#controllers-pattern-mvc) pour les principes et bonnes pratiques.
  - `types/` — interfaces et types TypeScript (props, DTOs, responses)
  - `functions/` — helpers et fonctions pures (reshapers, transformateurs, utilitaires)
  - `<Feature>.tsx` — composant présentational (UI, rendu, props)

> Note : Les bonnes pratiques détaillées (typage, tests, exposition des endpoints POST) sont documentées dans la section **Controllers (pattern MVC)** et dans **Construction d'un controller — Conventions obligatoires**.



### Construction d'un controller — Conventions obligatoires

- **Typage :** Les props du controller **doivent** utiliser `AppControllerInterface` en passant le schéma du formulaire. Exemple de signature :

```ts
type MyControllerProps = AppControllerInterface<
  MyFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_X.endpoint,
  typeof API_ENDPOINTS.POST.CREATE_X.dataReshape
>;
```

- **Endpoint POST (obligatoire quand utilisé) :** Si le controller effectue un `POST` (soumission), exposez dans les props au moins : `submitRoute` et `submitDataReshapeFn`, typés (idéalement avec `typeof API_ENDPOINTS.POST.<NAME>.endpoint` et `typeof API_ENDPOINTS.POST.<NAME>.dataReshape`) afin qu'ils puissent être passés au `useCommandHandler` ou au `submitCallback`.

- **Valeurs par défaut :** Il est recommandé d'initialiser `submitRoute` / `submitDataReshapeFn` depuis `API_ENDPOINTS` pour garantir la cohérence (voir exemple ci-dessous et [`ClassCreationController`](src/components/ClassCreation/controller/ClassCreationController.tsx)).

- **Tests & contrats :** Toute modification d'un `dataReshape` (ou ajout d'un endpoint) **doit** être accompagnée d'un test de contrat dans `src/tests/units/endpoints/` (voir `api-endpoints.config.contract.test.ts`).

**Exemple (pattern courant)**

```ts
export function MyController({
  form,
  pageId,
  submitRoute = API_ENDPOINTS.POST.CREATE_X.endpoint,
  submitDataReshapeFn = API_ENDPOINTS.POST.CREATE_X.dataReshape,
}: MyControllerProps) {
  const { submitCallback } = useCommandHandler({ form, pageId, submitRoute, submitDataReshapeFn });

  const handleValidSubmit = (values: MyFormSchema) =>
    submitCallback(values, { method: HTTP_METHODS.POST });

  return <FormComponent form={form} onSubmit={form.handleSubmit(handleValidSubmit)} />;
}
```

**Fichiers utiles :**
- [`AppControllerInterface`](src/types/AppControllerInterface.ts)
- [`useCommandHandler`](src/hooks/database/classes/useCommandHandler.ts)
- [`API_ENDPOINTS`](src/configs/api.endpoints.config.ts)
- [`ClassCreationController`](src/components/ClassCreation/controller/ClassCreationController.tsx)
- [`api-endpoints.config.contract.test.ts`](src/tests/units/endpoints/api-endpoints.config.contract.test.ts)

**Exemple simplifié (pattern courant)**
```tsx
// Dans un controller
import { HTTP_METHODS } from "@/configs/app.config.ts";

const handleValidSubmit = (values: FormSchema) => submitCallback(values, { method: HTTP_METHODS.POST });

return <FormComponent form={form} onSubmit={handleValidSubmit} />;
```


<h3 id="hocs-utilite-exemples"/>

### HOCs — utilité & exemples
- **But :** factoriser des patrons de présentation ou d'intégration (layout, ListMapper, intégration à react-hook-form) sans dupliquer du markup.
- **Règles :**
  - **HOCs = layout/integration only**. Évitez d'y placer de la logique métier lourde. Les exemples `withTitledCard`, `withListMapper`, `withController` montrent ce principe.
  - Documentez l'API du HOC et fournissez un exemple d'utilisation (ex. `withController` montre comment intégrer `react-hook-form`).


<a id="liste-des-hocs-usage-dans-des-vues"></a>
### Liste des HOCs (usage dans des vues)

<a id="withtitledcard"></a>
#### withTitledCard — Wrapper de présentation
- **But :** encapsuler un controller ou un composant présentational dans une Card standardisée (titre, description, actions).
- **Vue (exemple réel) :** `ClassCreation` montre l'utilisation typique :
```tsx
import { ClassCreationController } from '@/components/ClassCreation/controller/ClassCreationController.tsx';
import withTitledCard from '@/components/HOCs/withTitledCard.tsx';

const ClassCreationWithCard = withTitledCard(ClassCreationController);

function ClassCreationView(props) {
  return <ClassCreationWithCard {...props} />; // le controller reçoit titleProps, footerProps, form, etc.
}
```
- **Patterns :**
  - **Pattern A (controller + card) :** wrappez le controller (comme ci-dessus)
  - **Pattern B (composant présentational) :** wrappez un composant pur pour lui donner un layout
- **Logique abstraite (extrait) :**
```tsx
// simplifié
<Card className={className}>
  <CardHeader title={title} description={description} actions={actions} />
  <CardBody>
    <Wrapped {...props} />
  </CardBody>
  <CardFooter>{footer}</CardFooter>
</Card>
```
- **Retour / Abstraction :** un composant qui accepte `title`, `description`, `actions`, `className`, `form` (si applicable)
- **Pourquoi :** standardise l'apparence des sections et réduit le markup dans les vues.

---

<a id="withcontroller"></a>
#### withController — Intégration `react-hook-form`
- **But :** simplifier l'intégration d'un composant contrôlé par `react-hook-form`.
- **Vue (exemple d'utilisation dans une form) :**
```tsx
import withController from '@/components/HOCs/withController.tsx';
import Input from '@/components/Inputs/Input.tsx';

const InputWithController = withController(Input);

function MyForm({ form }) {
  return <InputWithController form={form} name="age" label="Âge" />;
}
```
- **Patterns :**
  - **Pattern A (simple) :** wrapper + props minimales
  - **Pattern B (avec options) :** `controllerProps` pour règles, defaultValue, etc.
- **Logique abstraite (extrait) :**
```tsx
<Controller
  name={name}
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <Wrapped {...restProps} field={field} fieldState={fieldState} />
      <FieldError errors={[fieldState.error]} />
    </Field>
  )}
/>
```
- **Retour / Abstraction :** composant qui expose `field`/`fieldState` et masque le `Controller` boilerplate.
- **Pourquoi :** évite la répétition du pattern `Controller` et garde la présentation séparée de la logique de formulaire.

---

<a id="withlistmapper"></a>
#### withListMapper — Mapping de listes
- **But :** générer rapidement un renderer pour des listes à partir d'un item component.
- **Vue (exemple d'utilisation) :**
```tsx
import withListMapper from '@/components/HOCs/withListMapper.tsx';
import StudentItem from '@/components/Students/StudentItem.tsx';

const StudentsList = withListMapper(StudentItem);

function StudentsView({ students }) {
  return <StudentsList items={students} emptyMessage="Aucun élève" />;
}
```
- **Patterns :**
  - **Pattern A (par défaut) :** `items` + rendu automatique
  - **Pattern B (custom render) :** `renderItem` pour surcharger le rendu d'un item
- **Logique abstraite (extrait) :**
```tsx
if (!items?.length) return <EmptyState message={emptyMessage} />;
return items.map(item => <Wrapped key={keyExtractor(item)} {...item} />);
```
- **Retour / Abstraction :** composant qui standardise l'itération, les keys et l'empty-state.
- **Pourquoi :** centralise la logique de listing et améliore la cohérence UI.

---

<a id="withcomboboxcommands"></a>
#### withComboBoxCommands — Enrichissement de Combobox
- **But :** ajouter une barre de commandes/actions à un champ combo/select.
- **Vue (exemple d'utilisation) :**
```tsx
import withComboBoxCommands from '@/components/HOCs/withComboBoxCommands.tsx';
import ComboBox from '@/components/Inputs/ComboBox.tsx';

const ComboWithCmd = withComboBoxCommands(ComboBox);

function TeachersView() {
  const commands = [{ id: 'create', label: 'Créer un enseignant' }];
  const handleCmd = (id) => { /* exécuter la commande */ };
  return <ComboWithCmd commands={commands} onCommand={handleCmd} />;
}
```
- **Patterns :**
  - **Pattern A (statique) :** `commands` tableau
  - **Pattern B (dynamique) :** `commands` fonction selon le contexte
- **Logique abstraite (extrait) :**
```tsx
<div className="combo-with-commands">
  <Wrapped {...props} />
  <CommandsMenu commands={commands} onCommand={onCommand} />
</div>
```
- **Retour / Abstraction :** expose `commands` et `onCommand(id, item)` ; sépare la logique d'actions du rendu du combo.
- **Pourquoi :** évite de dupliquer la logique des actions sur plusieurs combos.

---

<a id="withiconitem"></a>
#### withIconItem — Iconographie standardisée
- **But :** ajouter une icône configurable (position/size) à un item sans modifier son rendu interne.
- **Vue (exemple d'utilisation) :**
```tsx
import withIconItem from '@/components/HOCs/withIconItem.tsx';
import ListItem from '@/components/ui/list-item.tsx';

const IconListItem = withIconItem(ListItem);

function Sidebar() {
  return <IconListItem icon={<UserIcon />} iconPosition="left" />;
}
```
- **Patterns :**
  - **Pattern A (icône gauche) :** `iconPosition="left"`
  - **Pattern B (taille / style) :** `iconSize` + `className`
- **Logique abstraite (extrait) :**
```tsx
<div className={`icon-item ${className}`}>
  {icon && <span className={`icon ${iconPosition}`}>{icon}</span>}
  <Wrapped {...props} />
</div>
```
- **Retour / Abstraction :** composant qui gère l'espacement et les classes liées à l'icône.
- **Pourquoi :** standardise l'usage des icônes et assure une cohérence visuelle.

> **Note :** Ces HOCs restent légers et orientés présentation. Pour la logique métier lourde, préférez un `controller` ou un service dédié.


## Composants — Catalogue

Une vue d'ensemble des composants réutilisables fournis par le projet, avec un exemple d'usage (look), les patterns d'utilisation (A / B / C) et un lien vers leur emplacement.

> Note : les exemples ci-dessous sont des snippets usage (prêts à copier/coller) — ils servent à se faire une idée rapide du rendu et de l'API du composant.

---

### Buttons
- **Look / example**:
```tsx
import { LoginButton } from '@/components/Buttons/LoginButton';
import { SimpleAddButtonWithToolTip } from '@/components/Buttons/SimpleAddButton';

<LoginButton name="Sign in with Google" path="/icons/google.svg" url="/auth/google" />
<SimpleAddButtonWithToolTip toolTipText="Ajouter" onClick={() => {}} />
```
- **Patterns**: Pattern A — Standalone buttons; Pattern B — Buttons with tooltip / extra handler
- **Emplacement**: `src/components/Buttons/` (`LoginButton.tsx`, `SimpleAddButton.tsx`)

---

### Inputs
- **Look / example**:
```tsx
import { ControlledLabelledInput } from '@/components/Inputs/LaballedInputForController';

<ControlledLabelledInput form={form} name="email" title="Adresse e-mail" />
```
- **Patterns**: Pattern A — Controlled input via `withController`; Pattern B — list mapping via `withListMapper` (`ControlledInputList`)
- **Emplacement**: `src/components/Inputs/LaballedInputForController.tsx`

---

### Selects
- **Look / example**:
```tsx
import VerticalFieldSelect from '@/components/Selects/VerticalFieldSelect';

<VerticalFieldSelect label="Tâche" placeholder="Choisir...">
  <SelectItem value="task1">Task 1</SelectItem>
</VerticalFieldSelect>

// with controller
<VerticalFieldSelectWithController form={form} name="taskId" />
```
- **Patterns**: Pattern A — plain `VerticalFieldSelect`; Pattern B — `VerticalFieldSelectWithController` (react-hook-form); Pattern C — Extended with commands / add-new buttons
- **Emplacement**: `src/components/Selects/` (`VerticalFieldSelect.tsx`)

---

### Modal
- **Look / example**:
```tsx
// register in AppModals
{
  modalName: 'login',
  type: Modal,
  modalContent: LoginForm,
  contentProps: { inputControllers: inputLoginControllers }
}

// open programmatically
openDialog(null, 'login');
```
- **Patterns**: Pattern A — modal content = controller wrapped (ex: `LoginForm`); Pattern B — `ModalWithSimpleAlert`
- **Emplacement**: `src/components/Modal/`, `src/pages/AllModals/AppModals.tsx`

---

### Form components (LoginForm)
- **Look / example**:
```tsx
import LoginForm from '@/components/LoginForms/LoginForm';

<LoginForm />
```
- **Patterns**: Pattern A — use as page component; Pattern B — used as modal content (`modalMode = true`)
- **Emplacement**: `src/components/LoginForms/LoginForm.tsx` (+ `controller/LoginFormController.tsx`)

---

### Lists & Data Table
- **Look / example**:
```tsx
import DataTable from '@/components/data-table';

<DataTable columns={columns} rows={rows} />
```
- **Patterns**: Pattern A — with default renderer; Pattern B — override renderers / custom item components
- **Emplacement**: `src/components/data-table.tsx`, `src/components/Lists/`

---

### Charts
- **Look / example**:
```tsx
import ChartAreaInteractive from '@/components/chart-area-interactive';

<ChartAreaInteractive data={chartData} />
```
- **Patterns**: Pattern A — standalone visualization component
- **Emplacement**: `src/components/chart-area-interactive.tsx`

---

### Layout (Header / Sidebar / Footer)
- **Look / example**:
```tsx
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

<Header />
<Sidebar />
<Footer />
```
- **Patterns**: used in page layout; header accepts actions/menus, sidebar contains navigation list
- **Emplacement**: `src/components/Header/`, `src/components/Sidebar/`, `src/components/Footer/`

---

### Icons
- **Look / example**:
```tsx
import { Icon } from '@/components/Icons/Icon';

<Icon iconPath="/icons/user.svg" />
```
- **Patterns**: use `Icon` as presentational atom; prefer using icon components where required
- **Emplacement**: `src/components/Icons/` 

---

### Notes & Contribuer
- Si tu ajoutes un nouveau composant :
  - place-le sous `src/components/<Name>/` ;
  - export le composant principal dans un fichier index si utile ;
  - documente l'exemple d'usage dans cette section (snippet, patterns et emplacement) ;
  - ajoute un test unit / snapshot si le composant est complexe.

---

### Fichiers utiles (exemples)
- Controllers :
  - [ClassCreationController](src/components/ClassCreation/controller/ClassCreationController.tsx)
  - [DiplomaCreationController](src/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx)
- HOCs :
  - [withController](src/components/HOCs/withController.tsx) — intégration `react-hook-form` (Controller)
  - [withListMapper](src/components/HOCs/withListMapper.tsx) — wrapper pour `ListMapper`
  - [withTitledCard](src/components/HOCs/withTitledCard.tsx) — layout card + title
  - [withComboBoxCommands](src/components/HOCs/withComboBoxCommands.tsx) — commands wrapper
  - [withIconItem](src/components/HOCs/withIconItem.tsx) — icon helper

### Ajouter un nouveau controller / HOC
- Pour un nouveau feature : créez `src/components/<Feature>/controller/<Feature>Controller.tsx` et gardez la présentation dans `src/components/<Feature>/<Feature>.tsx`.
- Pour un nouveau HOC : ajoutez-le sous `src/components/HOCs/` et documentez l'usage (exemple et cas d'usage). Ajoutez des tests pour vérifier le comportement du HOC et un exemple d'intégration.

> Note : cette convention facilite la testabilité, la réutilisation et la séparation des responsabilités.

---

#### Créer un controller proprement — typage des `inputControllers`, schéma et rôle centralisateur

Voici une checklist et des exemples concrets pour garantir la cohérence des controllers et des vues :

- **Déclarer les `inputControllers` typés et réutilisables**

  - Définissez toujours une constante itérable exportée pour les contrôleurs d'entrée et **assurez-vous** qu'elle *satisfies* le type attendu par le composant/vues. Cela protège contre les régressions lors de la création du formulaire.

  ```ts
  // Ex: src/data/inputs-controllers.data.ts
  export const attendanceRecordCreationBaseControllers = [
    {
      name: "students",
      title: "Tâche",
      type: "button",
      placeholder: "Sélectionnez une tâche",
      fullWidth: true,
    },
  ] satisfies Parameters<typeof StepTwo>[0]["inputControllers"];
  ```
  
  - Cette variable permet de construire les données reçu par un composant du controlleur.

   ```ts
  <VerticalFieldSelectWithController
    {...inputController[0]}
    setRef={setRef}
    observedRefs={observedRefs}
    form={form}
    id={`${pageId}-${inputController.name}`}

    // C'est comme avoir : 
    // name="students"
    // fullWidth
    // placeholder={"Sélectionnez une tâche"}
    // title: "Tâche"
  >
  ```

- **Typage de la vue / du controller**

  - La vue ou le controller doit être typée avec `PageWithControllers<YourInputItemType>`. Exemple d'utilisation dans `StepTwo` :

  ```ts
  export function StepTwo({
    pageId = "attendance-record-creation",
    modalMode = false,
    className = "grid gap-4 max-w-2xl mx-auto",
    inputControllers = [],
    ...props
  }: Readonly<PageWithControllers<AttendanceRecordCreationInputItem>>) {
    // ...
  }
  ```

  - Cette déclaration garantit que `inputControllers` est du bon format et que la vue expose l'API attendue (form, handlers, etc.).

- **Typage de l'InputItem**

  - Pour une input list qui peut impliquer des fetchs (sélection depuis l'API, `apiEndpoint`/`dataReshapeFn`), utilisez le type `FetchingInputItem<TSchema>` :

  ```ts
  export type AttendanceRecordCreationInputItem =
    FetchingInputItem<AttendanceRecordCreationFormSchema>;
  ```

  - Pour des inputs statiques simples, préférez `InputItem<TSchema>`. L'important est d'être **cohérent** et d'expliquer quand utiliser `FetchingInputItem` vs `InputItem` (fetching behaviour, présence d'`apiEndpoint`, etc.).

- **Créer et exporter le schéma (Zod)**

  - Placez le schéma dans `src/models/…` et exposez une factory si le schéma dépend du contexte (ex: `availableTaskIds`). Exemple simplifié :

  ```ts
  // src/models/attendance-record-creation.models.ts
  const attendanceRecordCreationSchema = (data, availableTaskIds: string[] = []) =>
    z.object({/* ... */});

  export const attendanceRecordCreationSchemaInstance = (availableTaskIds: string[] = []) =>
    attendanceRecordCreationSchema(dataField, availableTaskIds);
  ```

  - Utilisez `zodResolver(schemaInstance)` dans `useForm` pour garder le form validé côté client :

  ```ts
  const form = useForm<AttendanceRecordCreationFormSchema>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance(user.availableTaskIds || [])),
    mode: "onTouched",
    defaultValues: { students: [] },
  });
  ```

- **Rôle centralisateur de l'`inputController`**

  - L'`inputController` sert **à la fois** d'assurance de typage (garantie que la forme du champ correspond aux props attendues par le composant) et de **centralisation** des métadonnées nécessaires au rendu (labels, placeholder, `apiEndpoint`, `dataReshapeFn`, `task`, flags `useButtonAddNew`, etc.).

- **Bonnes pratiques rapides**
  - Exportez les controllers depuis `src/data/inputs-controllers.data.ts` et utilisez `satisfies Parameters<typeof Component>[0]["inputControllers"]` pour la sécurité de type.
  - Choisissez `InputItem` pour des entrées statiques et `FetchingInputItem` pour les entrées basées sur fetchs; documentez le choix dans le fichier du controller.
  - Mettez le schéma Zod dans `src/models/…` et exposez une factory si le schéma a des dépendances runtime (ex: `availableTaskIds`).
  - Testez les reshapes et les controllers via des tests unitaires ciblés (Vitest) et ajoutez des contrats pour les reshapers si nécessaire.

---


<!-- --- -->
<h2 id="validation-des-props-des-composants"/>

## Validation des props des composants

Pour éviter les usages invalides en développement, certains composants se protègent et retournent `null` si des props indispensables sont manquantes ou si des props interdites sont passées.

- Les helpers vivent dans [Components Config](src/configs/app-components.config.ts) : `labelledInputContainsInvalid`, `controllerPropsInvalid`, `listMapperContainsInvalid`, `loginButtonContainsInvalid`, `menuButtonContainsInvalid` et `debugLogs`.

### Exemple complet — validation & usage (snippet)
Voici un exemple pratique montrant : 1) la définition des constantes d'acceptation / interdiction, 2) un helper `checkPropsValidity` plus informatif, 3) l'utilisation du guard en début de render et 4) un petit test Vitest.

- Dans `app-components.config.ts`, spécifier des props qui devront être vérifiées :
```tsx
export const LABELLED_INPUT_SHOULD_NOT_ACCEPT = ["useCommands", "creationButtonText"];
export const LABELLED_INPUT_REQUIRES = ["field", "fieldState"];

export const labelledInputContainsInvalid = (props: LaballedInputForControllerProps) =>
  checkPropsValidity(props, LABELLED_INPUT_REQUIRES, LABELLED_INPUT_SHOULD_NOT_ACCEPT);
```

- Dans `<LabelledInputForController/>`, appeler simplement la fonction et utilisez le logger pour retourner une alerte :
```tsx
// Exemple d'utilisation (top-of-render guard) — src/components/Inputs/LaballedInputForController.tsx
import { labelledInputContainsInvalid } from '@/configs/app-components.config';

export function LabelledInputForController<T extends FieldValues>(props: LaballedInputForControllerProps<T>) {
  if (labelledInputContainsInvalid(props)) {
    debugLogs("LabelledInputForController");
    return null; // garde : rendu bloqué si props invalides
  }

  // rendu normal
  return (
    <>
      <Label htmlFor={props.name ?? props.field.name}>{props.title}</Label>
      <Input {...props.field} id={props.name ?? props.field.name} aria-invalid={props.fieldState.invalid ?? false} />
    </>
  );
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
  - Quoi : vue modules/skills (module + subSkills).

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

Quelques helpers réutilisables stockés dans [`utils.ts`](src/utils/utils.ts) :

#### `preventDefaultAndStopPropagation(e)`

- **Objectif :** Empêcher le comportement par défaut et stopper la propagation d'un événement si présent.

- **Contexte :** Evite de répéter la logique

- **Exemple :**
```ts
import { preventDefaultAndStopPropagation } from '@/utils/utils';

function handleClick(e?: MouseEvent) {
  preventDefaultAndStopPropagation(e);

  // Same as : 
  e.preventDefault();
  e.stopPropagation();

  // logique métier
}
```

**Fichiers utiles :**
- [`preventDefaultAndStopPropagation`](src/utils/utils.ts) — implémentation

---

#### `wait(duration: number, message = '')`

- **Objectif :** Crée une promesse qui se résout après `duration` millisecondes et renvoie `message` si fourni.

- **Contexte :** Utile pour des pauses contrôlées dans les tests, attendre des animations ou temporiser des opérations asynchrones sans dépendre de timers externes.

- **Exemple :**
```ts
import { wait } from '@/utils/utils.ts';

await wait(150); // attend 150ms
const result = await wait(500, 'done'); // 'done' après 500ms
```

**Fichiers utiles :**
- [`wait`](src/utils/utils.ts) — implémentation
- [`modal.test.tsx`](src/tests/units/modal/modal.test.tsx) — usages en tests
- [`useQueryOnSubmit.ts`](src/hooks/database/useQueryOnSubmit.ts) — exemple d'usage

---

#### `mirrorProperties(properties)`

- **Objectif :** Construit un objet où chaque clé a pour valeur la même chaîne, à partir d'un tableau de chaînes ou d'un objet.

- **Contexte :** Permet d'avoir une source unique de vérité pour des constantes littérales (ex. méthodes HTTP) sans répéter manuellement `KEY: "KEY"`.

- **Exemple :**
```ts
import { mirrorProperties } from '@/utils/utils.ts';

const METHODS = ['GET','POST','PUT'] as const;
export const HTTP_METHODS = mirrorProperties(METHODS) as {
  [K in typeof METHODS[number]]: K
};

// HTTP_METHODS.GET === 'GET'
```

**Fichiers utiles :**
- [`mirrorProperties`](src/utils/utils.ts) — implémentation
- [`app.config.ts`](src/configs/app.config.ts) — exemple d'utilisation

---

#### `checkPropsValidity(props, required, forbidden)`

- **Objectif :** Vérifier la présence des clés requises et l'absence des clés interdites dans un objet `props` (retourne `true` si problème).

- **Contexte :** Utilisé comme garde en début de render pour certains composants afin d'empêcher des usages invalides en développement. La fonction est informative : elle logge des détails via `debugLogs` et gère les cas de `Proxy`/`Reflect`.

- **Exemple :**
```ts
import { checkPropsValidity } from '@/utils/utils.ts';

const required = ['field', 'fieldState'];
const forbidden = ['useCommands'];

if (checkPropsValidity(props, required, forbidden)) {
  debugLogs('NomDuComposant');
  return null; // bloquer le rendu en dev si nécessaire
}
```

**Fichiers utiles :**
- [`checkPropsValidity`](src/utils/utils.ts) — implémentation
- [`app-components.config.ts`](src/configs/app-components.config.ts) — usages et constantes de validation

---

#### `handleModalOpening({ e, dialogFns, modalName })`

- **Objectif :** Fermer toutes les modales ouvertes, puis ouvrir proprement une nouvelle modal.

- **Contexte :** Helper pratique pour s'assurer qu'une seule modal est ouverte à la fois (utilisé dans `LoginForm`, etc.).

- **Exemple :**
```ts
import { handleModalOpening } from '@/utils/utils';

handleModalOpening({ e, dialogFns: { closeAllDialogs, openDialog }, modalName: 'signup' });
```

**Fichiers utiles :**
- [`handleModalOpening`](src/utils/utils.ts)

---

#### Autres helpers & références rapides

- `dialogFns` — `{ closeAllDialogs, openDialog }` (ex: `LoginForm`).
- `dataReshape / dataReshapeFn` — fonctions de reshaping définies dans `API_ENDPOINTS` (voir `src/configs/api.endpoints.config.ts`).
- `FixtureCreatorBase` / classes de fixtures — utilitaires pour générer DTOs factices (`src/utils/FixtureCreator.ts`).

Voir `src/utils/utils.ts` pour la liste complète et les types.

---
  
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

## Configuration des logs

Le projet expose plusieurs constantes de configuration des logs dans [src/configs/app.config.ts](src/configs/app.config.ts). Elles permettent d'activer ou de désactiver rapidement des catégories de logs (proxy, observer de mutations, cache, requêtes, warnings composants) afin de réduire le bruit en développement ou en CI.

Principales constantes :
- `DEV_MODE` — `import.meta.env.DEV` (utile pour activer du code de debug en dev).
- `NO_PROXY_LOGS`, `NO_MUTATION_OBSERVER_LOGS`, `NO_CACHE_LOGS`, `NO_QUERY_LOGS`, `NO_COMPONENT_WARNING_LOGS` — lorsqu'elles sont `true`, les logs correspondants sont supprimés.

Exemple d'utilisation :
```ts
import { NO_QUERY_LOGS } from '@/configs/app.config';
if (!NO_QUERY_LOGS) {
  debugLogs('Query result', result);
}
```

Bonnes pratiques :
- Préférez `debugLogs()` au `console.*` pour garder la cohérence et le formatting des messages de debug.
- N'oubliez pas de remettre les logs verbeux à l'état souhaité avant d'ouvrir une PR (éviter de committer un état verbeux en production).
- Si vous avez besoin d'un contrôle dynamique, envisagez d'ajouter des variables d'environnement `VITE_*` lues depuis `app.config.ts` (optionnel).

Voir : `src/configs/app.config.ts`.

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
