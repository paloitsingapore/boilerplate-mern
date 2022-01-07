const jwt: any = jest.createMockFromModule('jsonwebtoken')

jwt.sign = jest.fn().mockImplementation(() => 'signed-token')

module.exports = jwt
