import * as href from 'sheet-router/href'
import * as qs from 'qs'
import * as rlite from 'rlite-router'
import * as twineLog from 'twine-js/lib/log'
import twine from 'twine-js'
import { Helix } from './types'
export { Twine } from 'twine-js'

export const log = twineLog.default

function combineObjects(a, b) {
  return Object.assign({}, a, b)
}

function wrap(routes, fn) {
  return Object.keys(routes).map(key => {
    let route = routes[key]
    return {
      [key]: fn(key, route),
    }
  }).reduce(combineObjects, {})
}

function createModel(model, routes, render) {
  if (routes) {
    if (model.models) {
      model.models.location = location(render)
    } else {
      model.models = {
        location: location(render),
      }
    }
  }
  return model
}

function parseQueryFromLocation(query: string) {
  // Note, need to remove the ? from the string before qs can parse it
  return query.length ? qs.parse(query.slice(1)) : {}
}

function stringifyQueryFromLocation(query: Object) {
  return `?${qs.stringify(query)}`
}

function location(rerender): Helix.ModelImpl<Helix.LocationState, Helix.LocationReducers, Helix.LocationEffects> {
  return {
    state: {
      pathname: '',
      params: {},
      query: {},
    },
    reducers: {
      receiveRoute(currentState, { pathname, params, query }) {
        return { pathname, params, query }
      },
    },
    effects: {
      set(currentState, currentActions, pathname) {
        window.history.pushState('', '', pathname)
        rerender(pathname)
      },
    },
  }
}

export default function (configuration) {
  const routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null
  const notFound = configuration.routes && configuration.routes.notFound ? configuration.routes.notFound : () => null
  const router = rlite(notFound, routes)
  const model = createModel(configuration.model, configuration.routes, renderCurrentLocation)
  const plugins = [onStateChange].concat(configuration.plugins || [])
  const store = twine<State, Actions>(model, plugins)
  const render = configuration.render

  let currentState = store.state
  let previousState = store.state
  let currentActions = store.actions
  let subscribe = store.subscribe
  let onLeaveHook
  let currentLocation

  function rerender(node) {
    if (node) {
      render(node, currentState, previousState, currentActions)
    }
  }

  function onStateChange(newState, newPrev, newActions) {
    currentState = newState
    previousState = newPrev
    currentActions = newActions
    renderCurrentLocation()
  }

  function getComponent(path) {
    // Let's strip out the path so rlite doesn't do strange things with it
    if (configuration.routes) {
      return router(path)
    } else {
      return configuration.component ? configuration.component : null
    }
  }

  function lifecycle(newLocation) {
    if (currentLocation === newLocation) {
      if (newLocation.onUpdate) {
        newLocation.onUpdate(currentState, previousState, currentActions)
      }
    } else {
      currentLocation = newLocation
      if (onLeaveHook) {
        onLeaveHook(currentState, previousState, currentActions)
        onLeaveHook = newLocation.onLeave
      }
      if (newLocation.onEnter) {
        newLocation.onEnter(currentState, previousState, currentActions)
      }
    }
  }

  function wrapRoutes(route, newLocation) {
    return function (params, _, pathname) {
      const differentRoute = currentState.location.pathname !== pathname
      const differentQuery = stringifyQueryFromLocation(currentState.location.query) !== (window.location.search || '?')
      if (differentRoute || differentQuery) {
        currentActions.location.receiveRoute({
          pathname,
          query: parseQueryFromLocation(window.location.search),
          params,
        })
        lifecycle(newLocation)
        onLeaveHook = newLocation.onLeave
        return false
      }
      return typeof newLocation === 'object'
        ? newLocation.view
        : newLocation
    }
  }

  function renderCurrentLocation() {
    rerender(getComponent(window.location.pathname))
  }

  function setLocationAndRender(location): void {
    const search = Object.keys(location.search).length ? `?${qs.stringify(location.search, { encode: false })}` : ''
    const path = `${location.pathname}${search}`
    window.history.pushState('', '', path)
    rerender(getComponent(location.pathname))
  }

  if (routes) {
    href(setLocationAndRender)
    window.onpopstate = renderCurrentLocation
  }

  renderCurrentLocation()
  return {
    state: currentState,
    actions: currentActions,
    subscribe,
  }
}
