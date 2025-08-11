import reactRefresh from "eslint-plugin-react-refresh";
import reactWebApi from "eslint-plugin-react-web-api";
import reactHooks from "eslint-plugin-react-hooks";
import reactDom from "eslint-plugin-react-dom";
import { globalIgnores } from "eslint/config";
import reactX from "eslint-plugin-react-x";
import tseslint from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";

export default tseslint.config([
  perfectionist.configs["recommended-line-length"],
  globalIgnores(["dist", "src/component/**"]),
  {
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [["type", "value"]],
          partitionByNewLine: false,
          type: "line-length",
          order: "asc",
        },
      ],
      "perfectionist/sort-array-includes": [
        "error",
        { type: "line-length", order: "asc" },
      ],
      "perfectionist/sort-named-exports": [
        "error",
        { type: "line-length", order: "asc" },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        { type: "line-length", order: "asc" },
      ],
      "perfectionist/sort-imports": [
        "error",
        { type: "line-length", order: "asc" },
      ],
      "perfectionist/sort-exports": [
        "error",
        { type: "line-length", order: "asc" },
      ],
      "perfectionist/sort-objects": [
        "error",
        { type: "line-length", order: "asc" },
      ],
      "perfectionist/sort-enums": [
        "error",
        { type: "line-length", order: "asc" },
      ],
      "react-hooks-extra/prefer-use-state-lazy-initialization": "warn",
      "react-hooks-extra/no-unnecessary-use-prefix": "warn",
      "react-naming-convention/component-name": "warn",
      "react-web-api/no-leaked-event-listener": "warn",
      "react-dom/no-dangerously-set-innerhtml": "warn",
      "react-x/no-class-component": "warn",
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactWebApi.configs.recommended,
      reactHooksExtra.configs.recommended,
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
      globals: globals.browser,
      parser: tseslint.parser,
      ecmaVersion: 2020,
    },
    plugins: {
      "react-naming-convention": reactNamingConvention,
      "react-x": reactX,
    },
    files: ["**/*.{ts,tsx}"],
  },
]);
