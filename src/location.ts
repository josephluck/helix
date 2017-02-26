import { Helix } from './types'

export default function location (notify) {
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
      set (_state, _mathods, pathname, shouldNotify) {
        if (shouldNotify !== false) {
          notify(pathname)
        }
        window.history.pushState('', '', pathname)
      },
    },
  }
}
