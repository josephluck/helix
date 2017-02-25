import { Sakura } from './types'

export default function (window): Sakura.LocationModel {
  return {
    scoped: true,
    state: window.location,
    reducers: {
      set (_state, location) {
        window.history.pushState('', '', location)
        return window.location
      },
    },
  }
}

export function walker (route, cb: Sakura.View) {
  return function (params) {
    return cb
  }
}
