const express = require('express');
import authRoutes from './routes/auth';
import logRoutes from './routes/log';
import timeRoutes from './routes/time';

const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(logRoutes);
app.use(timeRoutes);

// @ts-ignore
import dbo from './db/conn.ts';

const serverInstance = app.listen(port, () => {
  dbo.connectToServer((err: Error) => {
    if (err) {
      console.error(err);
    }
  });
  console.log(`Server is running on port: ${port}`);
});

async function stopServer() {
  await dbo.disconnect()
  return new Promise<void>((resolve, reject) => {
    serverInstance.close((err: Error) => {
      if (err) {
        reject(err)
      }
      resolve()
    });
  });
}

module.exports = { server: app, stopServer }
