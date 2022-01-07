// NOTE: We are using https://github.com/shelfio/jest-mongodb
// which allows us to test against an in-memory mongodb server
const ObjectId = require('mongodb').ObjectId
import * as mockArgon2 from 'argon2'
import {User, UserRole} from '../../common/models/User'
import {ARGON2_OPTIONS} from '../../constants/Security'

const { stopServer } = require('../../server.ts')
const {MongoClient} = require('mongodb')
// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest')
let requestWithSupertest


describe('Auth endpoints', () => {
  let connection
  let db
  let mockUserId
  const mockUser: User = {
    email: 'user@home.com',
    password: 'XXX',
    role: UserRole.user,
  }

  beforeAll(async () => {
    const { server } = require('../../server.ts')
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = await connection.db('paloMernDB')
    requestWithSupertest = supertest(server)
  })

  afterAll(async () => {
    await connection.close(true)
    await stopServer() // If you don't do this, an handle keeps Jest from exiting
  })

  it('POST /auth/signup should register a new user', async () => {
    const res = await requestWithSupertest.post('/auth/signup').send(mockUser)
    expect(mockArgon2.hash).toHaveBeenCalledWith(mockUser.password, ARGON2_OPTIONS)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body.acknowledged).toBe(true)
    expect(res.body).toHaveProperty('insertedId')

    mockUserId = res.body.insertedId

    const count = await db.collection('users').count()
    const savedUser = await db.collection('users').findOne({ _id: ObjectId(mockUserId) })
    expect(count).toBe(1)
    expect(savedUser).toEqual({
      _id: ObjectId(mockUserId),
      ...mockUser,
      password: 'hashed-value',
      signUpTimestamp: savedUser.signUpTimestamp
    })
  })

  it('POST /auth/login should authenticate a user', async () => {
    const { email, password } = mockUser
    const res = await requestWithSupertest.post('/auth/login').send({ email, password })
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({ accessToken: 'signed-token' })
  })
})
