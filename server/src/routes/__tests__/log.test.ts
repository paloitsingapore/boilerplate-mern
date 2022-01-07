// NOTE: We are using https://github.com/shelfio/jest-mongodb
// which allows us to test against an in-memory mongodb server
const ObjectId = require('mongodb').ObjectId
import ErrorCode from '../../common/types/ErrorCode'
import ErrorSeverity from '../../common/types/ErrorSeverity'
import {Log} from '../../common/models/Log'

const { stopServer } = require('../../server.ts')
const {MongoClient} = require('mongodb')
// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest')
let requestWithSupertest

describe('Log endpoints', () => {
  let connection
  let db
  let mockLogId
  const mockLog: Log = {
    description: 'A test log',
    message: 'Something happened',
    code: ErrorCode.CLIENT,
    severity: ErrorSeverity.ERROR,
    identifier: '',
    callstack: 'thing1, thing2',
    deviceInfo: {
      browser: 'Brave',
      os: 'Linux',
      device: '',
      userAgent: '',
      os_version: '',
    },
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
    await stopServer() // If you don't do this, a handle keeps Jest from exiting
  })

  it('POST /log should insert a log', async () => {
    const res = await requestWithSupertest.post('/log').send(mockLog)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body.acknowledged).toBe(true)
    expect(res.body).toHaveProperty('insertedId')

    mockLogId = res.body.insertedId

    const count = await db.collection('logs').count()
    const savedLog = await db.collection('logs').findOne({ _id: ObjectId(mockLogId) })
    expect(count).toBe(1)
    expect(savedLog).toEqual({
      _id: ObjectId(mockLogId),
      ...mockLog,
      timestamp: savedLog.timestamp
    })
  })

  it('GET /log/{id} should fetch a log by ID', async () => {
    const res = await requestWithSupertest.get(`/log/${mockLogId}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({ _id: mockLogId, ...mockLog, timestamp: res.body.timestamp })
  })

  it('GET /logs should fetch all logs', async () => {
    const res = await requestWithSupertest.get('/logs')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual([
      { _id: mockLogId, ...mockLog, timestamp: res.body[0].timestamp }
    ])
  })

  it('GET /logs/:from/:to should fetch all logs between 2 UNIX timestamps', async () => {
    const yesterday = Date.now() - 86400
    const dayBeforeYesterday = yesterday - 86400
    const tomorrow = yesterday + 86400 + 86400

    let res = await requestWithSupertest.get(`/logs/${yesterday}/${tomorrow}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual([
      { _id: mockLogId, ...mockLog, timestamp: res.body[0].timestamp }
    ])

    res = await requestWithSupertest.get(`/logs/${dayBeforeYesterday}/${yesterday}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual([])
  })

  it('DELETE /logs/:from/:to should delete all logs between 2 UNIX timestamps', async () => {
    const yesterday = Date.now() - 86400
    const dayBeforeYesterday = yesterday - 86400
    const tomorrow = yesterday + 86400 + 86400

    let res = await requestWithSupertest.delete(`/logs/${dayBeforeYesterday}/${yesterday}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({'acknowledged': true, 'deletedCount': 0})

    let count = await db.collection('logs').count()
    expect(count).toBe(1)

    res = await requestWithSupertest.delete(`/logs/${yesterday}/${tomorrow}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({'acknowledged': true, 'deletedCount': 1})

    count = await db.collection('logs').count()
    expect(count).toBe(0)
  })
})
