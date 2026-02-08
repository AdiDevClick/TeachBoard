import js from "@eslint/js";
import reactQuery from "@tanstack/eslint-plugin-query";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["**/dist/**", "**/build/**", "**/node_modules/**"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
      react,
      tseslint,
      "react-refresh": reactRefresh.plugin,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2023,
      sourceType: "module",
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite().rules,
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-tabs": "error",
    },
  },
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.vite(),
  reactQuery.configs["flat/recommended"],
  // Final global override to ensure legacy react-in-jsx-scope is disabled
  {
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          // @alwaysTryTypes always try to resolve types under `<root>@types`
          // directory even it doesn't contain any source code, like `@types/unist`
          alwaysTryTypes: true,
          project: "./tsconfig.json",
          extensions: [".ts", ".tsx"],
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
]);
