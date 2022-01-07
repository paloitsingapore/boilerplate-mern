import {Request, Response, Router} from 'express'
import {User, UserRole} from '../common/models/User'
import ErrorCode from '../common/types/ErrorCode'
import ErrorSeverity from '../common/types/ErrorSeverity'
import StatusCode from '../common/types/StatusCode'
import {ARGON2_OPTIONS} from '../constants/Security'
import dbo from '../db/conn'
import * as logUtil from '../utils/logUtil'
import * as argon2 from 'argon2'

const jwt = require('jsonwebtoken')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

const authRoutes = Router()

/**
 * Register a new user
 */
authRoutes.route('/auth/signup').post(async (req: Request, res: Response) => {
  const { email, password } = req.body
  let hashedPassword: string
  try {
    hashedPassword = await argon2.hash(password, ARGON2_OPTIONS)
  } catch (err) {
    await logUtil.logError(
      err,
      ErrorSeverity.ERROR,
      'Password hashing failed',
      ErrorCode.AUTH, email
    )
    throw Error('Password hashing failed')
  }

  let dbConnection = dbo.getDb()
  const user: User = {
    email,
    password: hashedPassword,
    signUpTimestamp: Date.now(),
    role: UserRole.user
  }
  dbConnection.collection('users').insertOne(user, (err: Error, result: any) => {
    if (err) {
      logUtil.error(err, 'Failed to insert user', ErrorCode.AUTH, email)
      throw err
    }
    res.status(result.acknowledged ? StatusCode.OK : StatusCode.BAD_REQUEST)
    res.json(result)
  })
})

/**
 * Authenticate a user
 */
authRoutes.route('/auth/login').post(async (req: Request, res: Response) => {
  const { email, password } = req.body
  let hashedPassword: string
  try {
    hashedPassword = await argon2.hash(password, ARGON2_OPTIONS)
  } catch (err) {
    await logUtil.error(err, 'Password hashing failed', ErrorCode.AUTH, email)
    throw Error('Password hashing failed')
  }

  let dbConnection = dbo.getDb()
  let query = { email, password: hashedPassword }
  let userRecord
  try {
    userRecord = await dbConnection.collection('users').findOne(query)
  } catch (e) {
    await logUtil.error(e, 'Failed to fetch user for login', ErrorCode.AUTH, email)
    throw e
  }

  if (userRecord) {
    const accessToken = jwt.sign({
      email: userRecord.email,
      role: userRecord.role
    }, accessTokenSecret)

    res.json({ accessToken })
  } else {
    res.send('Username or password incorrect')
  }
})

export default authRoutes
