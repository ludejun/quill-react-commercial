import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['index.tsx', 'utils.ts', 'i18n.ts', 'modules/keyboard.ts', 'quillTypes.ts'],
      reporter: ['text', 'lcov'],
    },
  },
});
