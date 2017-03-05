export default function location (rerender) {
  return {
    state: {
      pathname: '',
      params: {},
    },
    reducers: {
      receiveRoute (_state, { pathname, params }) {
        return { pathname, params }
      },
    },
    effects: {
      set (_state, _actions, pathname) {
        window.history.pushState('', '', pathname)
        rerender(pathname)
      },
    },
  }
}
