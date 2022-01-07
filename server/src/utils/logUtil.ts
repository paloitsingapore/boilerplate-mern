import {Log} from '../common/models/Log'
import ErrorCode from '../common/types/ErrorCode'
import ErrorSeverity from '../common/types/ErrorSeverity'
import dbo from '../db/conn'

export const log = async (log: Log) => {
  let dbConnection = dbo.getDb()
  log.timestamp = Date.now()
  return await dbConnection.collection('logs').insertOne(log)
}

export const logError = async (
    error: Error,
    severity: ErrorSeverity,
    description?: string,
    code?: ErrorCode,
    identifier?: string
) => {
  return await log({
    message: error.message,
    description: description,
    code: code,
    severity: severity,
    identifier: identifier,
    callstack: error.stack,
  })
}

export const info = async (
    error: Error,
    description?: string,
    code?: ErrorCode,
    identifier?: string
) => {
  return await logError(error, ErrorSeverity.INFO, description, code, identifier)
}

export const warning = async (
    error: Error,
    description?: string,
    code?: ErrorCode,
    identifier?: string
) => {
  return await logError(error, ErrorSeverity.WARNING, description, code, identifier)
}

export const error = async (
    error: Error,
    description?: string,
    code?: ErrorCode,
    identifier?: string
) => {
  return await logError(error, ErrorSeverity.ERROR, description, code, identifier)
}
