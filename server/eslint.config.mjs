// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "@typescript-eslint/consistent-type-imports": ["error", {
        "prefer": "type-imports",
        "disallowTypeAnnotations": false
      }],
      "@typescript-eslint/no-unsafe-call": ["off"],
      "import/order": [
        "error",
        {
          groups: [
            ["internal"],
            ["external"],
            ["type"],
          ],
          pathGroups: [
            {
              pattern: "@nestjs/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "typeorm",
              group: "external",
              position: "before",
            },
            {
              pattern: "**/*.module.*",
              group: "internal",
              position: "after",
            },
            {
              pattern: "**/*.controller.*",
              group: "internal",
              position: "after",
            },
            {
              pattern: "**/*.service.*",
              group: "internal",
              position: "after",
            },
            {
              pattern: "**/*.entity.*",
              group: "internal",
              position: "after",
            },
            {
              pattern: "**/*.dto.*",
              group: "internal",
              position: "after",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: ["@nestjs/**", "src/**/*", "**/*.module.*", "**/*.controller.*", "**/*.service.*", "**/*.entity.*"],
        },
      ],
    }
  },
  eslintConfigPrettier,
);
