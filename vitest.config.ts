import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      include: [
        'src/data/**/*.ts',
        'src/domain/**/*.ts',
        'src/infra/**/*.ts',
        'src/main/**/*.ts',
        'src/presentation/**/*.ts'
      ],
      exclude: [
        'src/main/factories/**/*',
        'src/**/*-protocols.ts',
        'src/presentation/protocols/index.ts',
        'src/main/docs/**/*',
        'src/main/server.ts',
        'src/main/config/**/*',
        'src/domain/test/**/*',
        'src/data/protocols/**/*',
        'src/domain/models/*',
        'src/domain/usecases/*',
        'src/**/index.ts',
        'src/presentation/test/**/*',
        'src/data/test/**/*'
      ],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    },
    setupFiles: ['./src/main/config/vitest-mongodb-config.ts'],
    mockReset: false,
    testTimeout: 30000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
