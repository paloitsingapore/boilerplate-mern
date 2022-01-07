module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts'],
  preset: './jest-preset.ts',
  'coveragePathIgnorePatterns': [
    '/node_modules/'
  ],
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globalTeardown: '<rootDir>/jest.teardown.ts',
  watchPathIgnorePatterns: [
    'globalConfig' // https://github.com/shelfio/jest-mongodb#6-jest-watch-mode-gotcha
  ],
};
