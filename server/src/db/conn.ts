import { AnyError, Callback } from 'mongodb'

const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let database: typeof MongoClient

export default {
  connectToServer: (callback: Callback<typeof MongoClient>) => {
    client.connect((err: AnyError, connection: any) => {
      if (connection) {
        database = connection.db('paloMernDB')
      }
      return callback(err)
    })
  },

  disconnect: async () => await client.close(),

  getDb: (): typeof MongoClient => {
    return database
  },
}
