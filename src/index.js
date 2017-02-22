const tansu = require('tansu')
const html = require('./html')
const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const history = require('sheet-router/history')

module.exports = function (opts) {
  const model = opts.model

  const routes = opts.routes
  const router = sheetRouter({ thunk: false }, routes)

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
        console.log('rerendering', params)
        let newDom = handler(state, prev, store.methods)
        if (dom) {
          dom = html.update(dom, newDom)
        }
        return newDom
      }
    })

    history(function (href) {
      newDom = router(href)
      html.update(dom, newDom)
      dom = newDom
      console.log('href changed, rerendering the DOM', href, dom)
    })

    dom = router(window.location.href)
    console.log(dom)
    return dom
  }
}
