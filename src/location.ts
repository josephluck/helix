import { Sakura } from './types'

export default function location (window) {
  return {
    scoped: true,
    state: {
      pathname: window.location.pathname,
      params: {},
    },
    reducers: {
      set (_state, { pathname, params }) {
        return { pathname, params }
      },
    },
    effects: {
      updateUrl (_state, _mathods, { pathname }) {
        window.history.pushState('', '', pathname)
      },
    },
  }
}
