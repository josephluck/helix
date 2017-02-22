const tansu = require('tansu')
const html = require('./html')
const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const href = require('sheet-router/href')

function createModel (model) {
  let newChildModels = Object.assign({}, model.models, {
    location: {
      state: window.location,
      reducers: {
        set (state, location) {
          window.history.pushState('', '', location)
          return Object.assign({}, state, {
            location: window.location
          })
        }
      }
    }
  })

  let newModel = Object.assign({}, model, {
    models: newChildModels
  })
  return newModel
}

module.exports = function (opts) {
  if (opts.model.models) {
    opts.model.models = {}
  }
  const model = createModel(opts.model)
  const routes = opts.routes
  const router = sheetRouter({ thunk: 'match' }, routes)

  let dom

  return function () {
    let state
    let prev

    function subscribe (_state, _prev) {
      state = _state
      prev = _prev
      router(window.location.href)
    }

    const store = tansu(subscribe)(model)

    state = store.state
    prev = store.state

    walk(router, function (route, handler) {
      return function (params) {
        return function () {
          let newDom = handler(state, prev, store.methods)
          if (dom) {
            dom = html.update(dom, newDom)
          }
          return newDom
        }
      }
    })

    href(function (href) {
      store.methods.location.set(href.pathname)
    })

    dom = router(window.location.href)
    return dom
  }
}
