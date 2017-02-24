const tansu = require('tansu')
const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const href = require('sheet-router/href')
const html = require('./html')
const decorateModel = require('./decorateModel')

module.exports = function (opts) {
  let router = sheetRouter({ thunk: false }, opts.routes)

  function cycle (renderer) {
    function render (state, prev, methods, child) {
      const props = {
        state: state,
        prev: prev,
        methods: methods
      }
      return renderer(props, child)
    }

    function subscribe (state, prev, methods) {
      return render(state, prev, methods, router(state.location.pathname))
    }
    const store = tansu(subscribe)(decorateModel(opts.model))

    walk(router, (route, cb) => {
      return (params) => {
        return cb
      }
    })

    href(function (path) {
      store.methods.location.set(path.pathname)
    })

    // First render
    render(store.state, store.state, store.methods, router(store.state.location.href))
  }

  function renderer (mount) {
    return function (props, child) {
      html.render(html.h(child, props), mount, mount.lastChild)
    }
  }

  return function render (mount) {
    let _renderer = renderer(mount)
    return cycle(_renderer)
  }
}
