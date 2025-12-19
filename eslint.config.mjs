
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import typescriptParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tseslint.plugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/purity': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/use-memo': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
