<!--
  README for TeachBoard
-->

# TeachBoard — Frontend (React + TypeScript + Vite)

Bienvenue ! Cette application représente le frontend de TeachBoard, une interface pédagogique développée en React et TypeScript.

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
# Cloner le dépôt (si nécessaire)
git clone https://github.com/AdiDevClick/TeachBoard.git
cd TeachBoard/teacherboard/frontend

# Installer les dépendances
npm ci
```

Remarque : si vous préférez `npm install` pour récupérer les packages sans fichier lock, vous pouvez remplacer `npm ci` par `npm install`.

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

Le serveur de développement Vite redirige toutes les requêtes `GET/POST/…` sur `/api/*` vers la valeur `VITE_BACKEND_URL` (au cas où vous ayez un backend en local).

Exemple dans `vite.config.ts` :

```ts
const backendUrl = process.env.VITE_BACKEND_URL || 'https://localhost:8443';
```

Si l'API backend est indisponible et que vous voulez développer côté frontend, vérifiez si des mocks sont présents dans `/src/data` ou dans certains hooks.

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

Actuellement, il n'y a pas de script de test (`jest`, `vitest`) attaché au projet frontend. Si vous souhaitez ajouter des tests, nous recommandons `vitest` + `@testing-library/react`.

<!-- --- -->

## Modales (Dialog)

Le projet utilise un système centralisé de modales (Dialog) via un `DialogProvider` et le hook `useDialog`.

- Déclaration des modales :
  - Toutes les modales sont listées dans `src/pages/AllModals/AppModals.tsx` via `defineStrictModalsList([ ... ])`.
  - Chaque modal possède une `modalName` (string unique), un `type` (`Modal` ou `WithSimpleAlert`) et un `modalContent` pour le contenu.
  - Les noms valides sont typés dans `src/configs/app.config.ts` (`AppModalNames`).

- Ouvrir une modal :

```tsx
import { useDialog } from '@/hooks/contexts/useDialog';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const { openDialog } = useDialog();

  const handleClick = (e) => openDialog(e, 'login');

  return <Button onClick={handleClick}>Ouvrir la modal de login</Button>;
}
```

- Fermer une modal :

```tsx
const { closeDialog } = useDialog();
// Dans une handler d'évènement
closeDialog(e, 'login'); // ferme la modal nommée 'login'

// Ou via le bouton fourni par le composant modal :
// <DialogClose asChild><Button>Fermer</Button></DialogClose>
```

- Autres méthodes utiles :
  - `closeAllDialogs()` — ferme toutes les modales ouvertes
  - `isDialogOpen('login')` — vérifie si une modal est ouverte
  - `onOpenChange(modalName)` — callback pour gérer le changement d'état

- À savoir :
  - Le composant `Modal` gère aussi l'historique du navigateur (pushState/replaceState), de sorte que l'ouverture d'une modal ajoute `/{modalName}` à l'URL et la navigation arrière la ferme (et inversement).
  - La plupart des handlers d'ouverture/fermeture attendent un `Event` DOM en premier argument et appellent `preventDefault()`/`stopPropagation()` (voir `DialogProvider`). Si vous devez appeler une méthode depuis un contexte non-évènementiel, passez un objet factice :

```ts
openDialog(null, 'login');
```

  - La meilleure pratique reste d'appeler `openDialog` dans un handler d'événement provenant d'un composant utilisateur (ex : `onClick`).

### Noms de modales disponibles

Les noms de modales supportés par l'application se trouvent dans `src/configs/app.config.ts` (type `AppModalNames`). Voici la liste actuelle :

- `login`
- `apple-login`
- `signup`
- `pw-recovery`
- `pw-recovery-email-sent`
- `class-creation`

> Remarque : la liste ci-dessus vient du typage, mais certaines modales peuvent ne pas être déclarées dans `AppModals`. Consultez `src/pages/AllModals/AppModals.tsx` pour visualiser la liste appliquée actuellement.


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

Ce repo appartient à AdiDevClick / TeachBoard. Pour des questions, utilisez les Issues dans GitHub ou contactez les mainteneurs du projet.

---

Astuce : si vous souhaitez que je prépare aussi un guide de déploiement (sur Vercel / Netlify / GitHub Pages) ou un modèle de page Demo « statique », dites-le et je l’ajoute !
