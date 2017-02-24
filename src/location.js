module.exports = function () {
  return {
    scoped: true,
    state: window.location,
    reducers: {
      set (state, location) {
        window.history.pushState('', '', location)
        return window.location
      }
    }
  }
}