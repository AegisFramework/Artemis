import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['tsconfig.json'],
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    ignores: [
      'dist',
      'docs',
      'test',
      '.yarn',
      '.pnp.loader.mjs',
      '.pnp.cjs',
    ],
  }
];
