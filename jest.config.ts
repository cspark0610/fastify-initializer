import type { JestConfigWithTsJest } from 'ts-jest/dist/types';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['lcovonly', 'clover', 'text'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['jest-extended/all'],
  testMatch: ['integration/*.{test,it}.{ts,js}', '**/*.{it,test}.{ts,js}'],
  setupFiles: ['./jest.setup.ts'],
  modulePaths: [compilerOptions.baseUrl],
  testTimeout: 40000,
  verbose: true
};

export default config;
