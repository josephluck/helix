import * as sheetRouter from 'sheet-router'
import * as walk from 'sheet-router/walk'
import html from './html'
import cycle from './cycle'
import location from './location'

function renderer (mount) {
  return function (props, child) {
    html.render(html.h(child, props), mount, mount.lastChild)
  }
}

function makeModel (model) {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: location(window)
    })
  })
}

export default function (opts) {
  return function (mount) {
    let morph = renderer(mount)
    let model = makeModel(opts.model)
    let router = sheetRouter({ thunk: false }, opts.routes)
    walk(router, (route, cb) => {
      return (params) => {
        return cb
      }
    })
    return cycle(morph, model, router)
  }
}
