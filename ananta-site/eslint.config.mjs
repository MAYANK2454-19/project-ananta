import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

/**
 * Flat config. `next lint` is deprecated in Next 15.5 and removed in 16, so the
 * `lint` script calls the ESLint CLI directly. eslint-config-next is still
 * eslintrc-style, hence FlatCompat.
 */
const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'next-env.d.ts',
      'public/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Event photos and generated OG art go through next/image; a bare <img>
      // is almost always an oversight here.
      '@next/next/no-img-element': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Build-time scripts are Node, not browser, and may log freely.
  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    rules: { 'no-console': 'off' },
  },
  prettier,
];

export default config;
