import * as budo from 'budo'

export interface FrontEndServer {
  domain: string
  stop: () => any
}

export default function startApp(app: string): Promise<FrontEndServer> {
  let server
  console.info('Setting up front-end server for app: ', app)
  return new Promise(resolve => {
    server = budo(app, {
      live: true,
      port: 8000,
    })
      .on('connect', ev => {
        console.log('Running front-end server at url: ', ev.uri)
        resolve({
          domain: ev.uri,
          stop() {
            console.log('Closing front-end server for app: ', app)
            server.close()
          }
        })
      })
  })
}