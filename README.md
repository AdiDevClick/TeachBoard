<!--
  README for TeachBoard
-->

# TeachBoard — Frontend (React + TypeScript + Vite)

Bienvenue !

Cette application représente le frontend de TeachBoard, une interface pédagogique développée en React et TypeScript.

## Aperçu

- Stack principale : React, TypeScript, Vite, TailwindCSS
- Proxy dev : le serveur Vite redirige /api vers l'API backend définie par `VITE_BACKEND_URL`
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

Il envoie ces requêtes vers l'URL définie dans la variable d'environnement `VITE_BACKEND_URL`.

Ceci est utile si vous avez un backend local et que vous voulez rediriger les appels API vers votre machine.

Exemple dans `vite.config.ts` :

```ts
const backendUrl = process.env.VITE_BACKEND_URL || 'https://localhost:8443';
```

Si l'API backend est indisponible et que vous voulez développer côté frontend, vérifiez si des mocks sont présents.

Les mocks peuvent se trouver dans `/src/data` ou être intégrés dans certains hooks.

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

## Tests

Le projet utilise Vitest pour les tests unitaires et d'intégration côté frontend.

Voici comment lancer et écrire des tests, ainsi que des bonnes pratiques spécifiques au projet.

### Commandes communes
- Lancer tous les tests en mode watch (développement)

```powershell
npm test / npm run test ou 
```

- Lancer les tests une seule fois (exécution CI)

```powershell
npm run test -- run
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

<!-- --- -->

## Modales ([`<Dialog/>`](src/components/ui/dialog.tsx))

Le projet utilise un système centralisé de modales (Dialog).

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
- Vérifiez la variable `VITE_BACKEND_URL` si les requêtes API échouent
- Si HMR ne se met pas à jour, redémarrez `npm run dev` et videz le cache du navigateur

---

## Licence & Contact

Ce repo appartient à AdiDevClick / TeachBoard.

Pour des questions, utilisez les Issues GitHub ou contactez les mainteneurs du projet.

---

Astuce : si vous souhaitez que je prépare aussi un guide de déploiement (Vercel / Netlify / GitHub Pages)
ou un modèle de page Demo « statique », dites-le et je l’ajoute !
