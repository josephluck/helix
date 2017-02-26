import { Helix } from './types'

export default function location (window) {
  return {
    scoped: true,
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
      set (_state, _mathods, pathname) {
        window.history.pushState('', '', pathname)
      },
    },
  }
}
