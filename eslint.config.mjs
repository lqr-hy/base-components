import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx,stories.tsx}']
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect' // Automatically detect the React version
      }
    }
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      'packages/**/*.test.*',
      '**/play/',
      '**/server/',
    ]
  }
];
