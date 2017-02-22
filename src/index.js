const tansu = require('tansu')
const html = require('./html')
const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const href = require('sheet-router/href')

module.exports = function (opts) {
  const model = opts.model

  const routes = opts.routes
  const router = sheetRouter({ thunk: 'match' }, routes)

  let dom

  return function () {
    let state
    let prev

    const store = tansu(function (_state, _prev) {
      state = _state
      prev = _prev
      router(window.location.href)
    })(model)

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
      window.history.pushState("", "", href.pathname)
      router(href.pathname)
    })

    dom = router(window.location.href)
    return dom
  }
}
