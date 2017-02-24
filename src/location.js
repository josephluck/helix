module.exports = function (win) {
  if (!win) {
    win = window
  }
  return {
    scoped: true,
    state: win.location,
    reducers: {
      set (state, location) {
        win.history.pushState('', '', location)
        return win.location
      }
    }
  }
}