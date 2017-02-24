const tansu = require('tansu')
const href = require('sheet-router/href')

module.exports = function (renderer, model, router) {
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

  const store = tansu(subscribe)(model)

  href(function (path) {
    store.methods.location.set(path.pathname)
  })

  render(store.state, store.state, store.methods, router(store.state.location.href))
}