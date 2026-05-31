import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';

export default [
  // Global ignores
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'template/'],
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Catch unused imports/vars (DX essencial)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Proibir any explícito (mas permitir implícito por agora — estrito gradual)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Consistência de tipos
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // Padrão do projeto: sem console.log em produção
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Astro files
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
    plugins: {
      astro: astroPlugin,
    },
    rules: {
      // Regras recomendadas do plugin astro
      ...astroPlugin.configs['flat/recommended'][1]?.rules,
      // Sem script inline desnecessário (exceção: set:html para JSON-LD é legítimo)
      'astro/no-unused-define-vars-in-style': 'error',
    },
  },

  // Scripts client em src/scripts/ — mais permissivo (sem parserOptions.project)
  {
    files: ['src/scripts/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
