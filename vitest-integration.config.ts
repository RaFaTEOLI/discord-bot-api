import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      include: ['src/main/**/*.ts'],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100
    },
    setupFiles: ['./src/main/config/vitest-mongodb-config.ts'],
    mockReset: false,
    testTimeout: 30000,
    include: ['**/*.test.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
