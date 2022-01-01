// This module merges multiple jest presets and is loaded in jest.config.ts

// eslint-disable-next-line node/no-unpublished-require
const tsPreset = require('ts-jest/jest-preset')
// eslint-disable-next-line node/no-unpublished-require
const mockMongoPreset = require('@shelf/jest-mongodb/jest-preset')

module.exports = {
  ...tsPreset,
  ...mockMongoPreset,
}
