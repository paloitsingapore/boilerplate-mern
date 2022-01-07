const argon2: any = jest.createMockFromModule('argon2')

argon2.hash = jest.fn().mockImplementation(async () => {
  return Promise.resolve('hashed-value')
})

module.exports = argon2
