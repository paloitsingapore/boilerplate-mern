import * as fs from 'fs'

export default async () => {
  // https://github.com/shelfio/jest-mongodb/issues/214#issuecomment-659535865
  const globalConfPath = `${process.cwd()}/globalConfig.json`
  if (fs.existsSync(globalConfPath)) {
    await fs.promises.unlink(globalConfPath)
  }
}
