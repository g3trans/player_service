module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/lambda'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
