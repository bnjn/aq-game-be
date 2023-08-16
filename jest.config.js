/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"
  ],
  slowTestThreshold: 120,
  setupFilesAfterEnv: ['./jest.setup.redis-mock.js']
};