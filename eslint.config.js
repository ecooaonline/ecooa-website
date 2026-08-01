import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import * as astroParser from 'astro-eslint-parser';

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

  // Scripts .mjs que GERAM o site publicado (deploy/). Até 2026-08-01 estes
  // arquivos não tinham análise estática nenhuma: o ESLint só olhava para o
  // projeto Astro, que não está no ar. Ou seja, o código que constrói o site
  // real era o único sem rede de proteção.
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        global: 'writable',
        Buffer: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
        structuredClone: 'readonly',
        // estes scripts abrem um Chromium e passam funções que rodam DENTRO da
        // página (page.evaluate). Ali valem os globais do navegador.
        document: 'readonly',
        window: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        getComputedStyle: 'readonly',
        requestAnimationFrame: 'readonly',
        matchMedia: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      eqeqeq: ['warn', 'smart'],
      'prefer-const': 'warn',
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
