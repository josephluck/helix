const tansu = require('tansu')
const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const href = require('sheet-router/href')
const html = require('./html')

function createModel (model) {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: {
        scoped: true,
        state: window.location,
        reducers: {
          set (state, location) {
            window.history.pushState('', '', location)
            return window.location
          }
        }
      }
    })
  })
}

module.exports = function (opts) {
  let state
  let prev
  let methods
  let router = sheetRouter({ thunk: false }, opts.routes)

  function cycle (renderer) {
    function render (_state, _prev, child) {
      const props = {
        state: _state ? _state : state,
        prev: _prev ? _prev : prev,
        methods: methods
      }
      return renderer(props, child)
    }

    // Subscribe to store updates
    const subscribe = (state, prev) => render(state, prev, router(state.location.pathname))
    const store = tansu(subscribe)(createModel(opts.model))

    state = store.state
    prev = store.state
    methods = store.methods

    walk(router, (route, cb) => {
      return (params) => {
        return cb
      }
    })

    href(function (path) {
      store.methods.location.set(path.pathname)
    })

    let child = router(window.location.href)
    render(state, prev, child)
  }

  function renderer (mount) {
    let dom = null

    return function (props, child) {
      dom = html.render(html.h(child, props), mount, mount.lastChild)
    }
  }

  return function render (mount) {
    let _renderer = renderer(mount)
    return cycle(_renderer)
  }
}
