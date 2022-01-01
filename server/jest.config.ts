/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts'],
  roots: ['src'],
  preset: './jest-preset.ts',
  'coveragePathIgnorePatterns': [
    '/node_modules/'
  ],
  watchPathIgnorePatterns: [
    'globalConfig' // https://github.com/shelfio/jest-mongodb#6-jest-watch-mode-gotcha
  ],
};
