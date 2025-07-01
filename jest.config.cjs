module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        target: 'ES2020',
        lib: ['ES2020'],
        module: 'ESNext',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        allowImportingTsExtensions: true,
      }
    }],
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}; 