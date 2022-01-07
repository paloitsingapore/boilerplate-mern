import {Request, Response, Router} from 'express'
import ErrorCode from '../common/types/ErrorCode'
import ErrorSeverity from '../common/types/ErrorSeverity'
import StatusCode from '../common/types/StatusCode'
import {DeviceInfo, Log} from '../common/models/Log'
import * as logUtil from '../utils/logUtil'
import dbo from '../db/conn'

const ObjectId = require('mongodb').ObjectId

const logRoutes = Router()

/**
 * Get all logs
 */
logRoutes.route('/logs').get((req: Request, res: Response) => {
  let dbConnection = dbo.getDb()
  dbConnection
    .collection('logs')
    .find({})
    .toArray((err: Error, result: Log[]) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
})

/**
 * Get logs in a range between 2 UNIX timestamps
 * @param from number
 * @param to number
 */
logRoutes.route('/logs/:from/:to').get((req: Request, res: Response) => {
  let dbConnection = dbo.getDb()
  let query = {
    timestamp: {
      $gte: parseInt(req.params.from, 10),
      $lt: parseInt(req.params.to, 10)
    }
  }
  dbConnection
    .collection('logs')
    .find(query)
    .toArray((err: Error, result: Log[]) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
})

/**
 * Get a single log by its ObjectId
 * @param id string
 */
logRoutes.route('/log/:id').get((req: Request, res: Response) => {
  let dbConnection = dbo.getDb()
  let query = { _id: ObjectId(req.params.id) }
  dbConnection.collection('logs').findOne(query, (err: Error, result: Log) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

/**
 * Add a log
 * @param body Log
 * @see Log
 */
logRoutes.route('/log').post(async (req: Request, res: Response) => {
  let log: Log = {
    description: req.body.description,
    message: req.body.message,
    code: ErrorCode.CLIENT,
    severity: req.body.severity || ErrorSeverity.ERROR,
    identifier: req.body.identifier,
    callstack: req.body.callstack,
    deviceInfo: req.body.deviceInfo as DeviceInfo,
  }

  try {
    const result = await logUtil.log(log);
    res.status(result.acknowledged ? StatusCode.OK : StatusCode.BAD_REQUEST)
    res.json(result)
  } catch (e) {
    console.log(e)
    throw e
  }
})

/**
 * Update a log
 * @param body Log
 * @see Log
 */
logRoutes.route('/log/:id').put((req: Request) => {
  let dbConnection = dbo.getDb()
  let query = { _id: ObjectId(req.params.id) }
  let newvalues = {
    $set: {
      description: req.body.description,
      message: req.body.message,
      code: req.body.code,
      type: req.body.type,
      identifier: req.body.identifier,
      callstack: req.body.callstack,
      device_info: req.body.device_info,
    },
  }
  dbConnection
    .collection('logs')
    .updateOne(query, newvalues, (err: Error, res: Response) => {
      if (err) {
        throw err
      }
      res.json(res)
    })
})

/**
 * Delete logs in a range between 2 UNIX timestamps
 * @param from number
 * @param to number
 */
logRoutes.route('/logs/:from/:to').delete((req: Request, res) => {
  let dbConnection = dbo.getDb()
  let query = {
    timestamp: {
      $gte: parseInt(req.params.from, 10),
      $lt: parseInt(req.params.to, 10)
    }
  }
  dbConnection.collection('logs').deleteMany(query, (err: Error, result: any) => {
    if (err) {
      throw err
    }
    res.status(result.acknowledged ? StatusCode.OK : StatusCode.BAD_REQUEST)
    res.json(result)
  })
})

/**
 * Delete all logs
 */
logRoutes.route('/logs').delete((req: Request, res) => {
  let dbConnection = dbo.getDb()
  dbConnection.collection('logs').deleteMany({}, (err: Error, result: any) => {
    if (err) {
      throw err
    }
    res.status(result.acknowledged ? StatusCode.OK : StatusCode.BAD_REQUEST)
    res.json(result)
  })
})

export default logRoutes
