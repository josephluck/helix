import budo from 'budo'
import tsify from 'tsify'

const port = 1234
const base = `http://localhost:${port}`

let server: any

beforeAll(done => {
  server = budo(__dirname + '/app.ts', {
    port,
    browserify: {
      plugin: [tsify],
    },
    pushstate: true,
  }).on('connect', () => {
    console.info(`ui server started: ${base}`)
    done()
  })
})

afterAll(() => {
  console.info(`ui server stopped: ${base}`)
  server.close()
})

export { port, base }
