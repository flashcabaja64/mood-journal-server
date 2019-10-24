const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.skip('Protected Endpoints', () => {
  let db

  const {
    testUsers,
    testEntries,
    testComments,
  } = helpers.makeEntriesFixtures()

  before('make knex instance', () => {
    console.log(process.env.NODE_ENV)
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  afterEach('cleanup', () => helpers.cleanTables(db))

  after('disconnect from db', () => db.destroy())
  before('cleanup', () => helpers.cleanTables(db))

  before('insert entries', () => {
    helpers.seedEntriesTables(
      db,
      testUsers,
      testEntries,
      testComments
    )
  })
  const protectedEndpoints = [
    {
      name: 'GET /api/entries/:entry_id',
      path: '/api/entries/1',
      method: supertest(app).get
    },
    {
      name: 'GET /api/entries/:entry_id/comments',
      path: '/api/entries/1/comments',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/comments',
      path: '/api/comments',
      method: supertest(app).post,
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds with 401 'Missing bearer token' when no basic token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token`})
      })
      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})