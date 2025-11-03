import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  ...pluginQuery.configs["flat/recommended"],
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // "plugin:@tanstack/query/recommended",
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Enforce 2 spaces indentation and forbid tabs
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-tabs": "error",
      // Prefer value imports rather than always using `import type` when possible
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "no-type-imports" },
        // { prefer: "type-imports" },
      ],
    },
  },
]);
