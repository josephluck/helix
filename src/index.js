const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const html = require('./html')
const cycle = require('./cycle')
const location = require('./location')

function renderer (mount) {
  return function (props, child) {
    html.render(html.h(child, props), mount, mount.lastChild)
  }
}

function makeModel (model) {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: location()
    })
  })
}

module.exports = function (opts) {
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
