import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'UWRL',
    include: ['src/**/*.test.ts'],
    environment: 'node',
    setupFiles: [],
    globals: true,
    isolate: true,
    threads: false,
    clearMocks: true,
  },
});