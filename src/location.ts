import { Helix } from './types'

export default function location (rerender) {
  return {
    state: {
      pathname: window.location.pathname,
      params: {},
    },
    reducers: {
      receiveRoute (_state, { pathname, params }) {
        return { pathname, params }
      },
    },
    effects: {
      set (_state, _actions, pathname) {
        rerender(pathname)
        window.history.pushState('', '', pathname)
      },
    },
  }
}
