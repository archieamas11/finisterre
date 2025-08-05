import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import perfectionist from 'eslint-plugin-perfectionist'
import reactNamingConvention from 'eslint-plugin-react-naming-convention'
import reactX from 'eslint-plugin-react-x'
import reactWebApi from 'eslint-plugin-react-web-api'
import reactHooksExtra from 'eslint-plugin-react-hooks-extra'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  perfectionist.configs['recommended-alphabetical'],
  perfectionist.configs['recommended-natural'],
  perfectionist.configs['recommended-line-length'],

  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactWebApi.configs.recommended,
      reactHooksExtra.configs.recommended,
      reactDom.configs.recommended,
    ],
    plugins: {
      "react-naming-convention": reactNamingConvention,
      "react-x": reactX,
      "react-web-api": reactWebApi,
      "react-hooks-extra": reactHooksExtra,
      "react-dom": reactDom,
      perfectionist,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-naming-convention/component-name": "warn",
      "react-x/no-class-component": "warn",
      "react-web-api/no-leaked-event-listener": "warn",
      "react-hooks-extra/no-unnecessary-use-prefix": "warn",
      "react-hooks-extra/prefer-use-state-lazy-initialization": "warn",
      "react-dom/no-dangerously-set-innerhtml": "warn",
      'perfectionist/sort-imports': 'error',
    },
  },
])
