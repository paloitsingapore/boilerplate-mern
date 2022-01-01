// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest')
const { server, stopServer } = require('../../server.ts')
const requestWithSupertest = supertest(server)

describe('Time Endpoints', () => {
  afterAll(async () => {
    await stopServer() // If you don't do this, an handle keeps Jest from exiting
  })

  it('GET /time should return the server time', async () => {
    const res = await requestWithSupertest.get('/time');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('utc')
    expect(res.body).toHaveProperty('iso')
    expect(res.body).toHaveProperty('timestamp')
  });
});
