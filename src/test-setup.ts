import budo from 'budo'
import tsify from 'tsify'

const port = 1234
const base = `http://localhost:${port}`

let server

beforeAll(done => {
  server = budo(__dirname + '/test-app.ts', {
    port,
    browserify: {
      plugin: [tsify],
    },
    pushstate: true,
  })
    .on('connect', () => {
      console.log('server started on port 1234')
      done()
    })
})

afterAll(() => {
  console.log('Server closed')
  server.close()
})

export { port, base }
