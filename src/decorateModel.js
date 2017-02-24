module.exports = function (model) {
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