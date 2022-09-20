const { pathsToModuleNameMapper } = require('ts-jest')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '.ts': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  reporters: ['default', 'github-actions'],
  moduleNameMapper: pathsToModuleNameMapper(
    { '~/*': ['./src/*'] },
    { prefix: '<rootDir>/' }
  ),
}
