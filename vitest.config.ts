import { defineConfig } from 'vitest/config';

export default defineConfig({
  optimizeDeps: {
    disabled: true
  },
  test: {
    globals: true,
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    reporters: ['default'],
    testTransformMode: {
      web: ['*.{ts,tsx}']
    },
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      exclude: ['play/**', 'packages/components/*/style/**']
    }
  }
});
