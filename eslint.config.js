import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  ...pluginQuery.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      // Enforce 2 spaces indentation and forbid tabs
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-tabs": "error",
      // Prefer value imports rather than always using `import type` when possible
      // "@typescript-eslint/consistent-type-imports": [
      //   "error",
      //   { prefer: "no-type-imports" },
      //   // { prefer: "type-imports" },
      // ],
      // Disallow importing the `console` module (e.g. `import console from 'console'`)
      "no-restricted-imports": [
        "error",
        {
          paths: ["console"],
        },
      ],
      // Warn when using `console.*` directly (allow warn/error by default if needed)
      // "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
