import * as href from 'sheet-router/href'
import * as qs from 'qs'
import * as rlite from 'rlite-router'
import * as twineLog from 'twine-js/lib/log'
import twine, { Twine } from 'twine-js'
import * as Types from './types'
export { Twine } from 'twine-js'
export { Helix } from './types'

export const log = twineLog.default

function combineObjects(a: any, b: any) {
  return Object.assign({}, a, b)
}

function wrap<S, A>(
  routes: Types.Helix.Routes<S, A>,
  fn: (key: string, route: any) => any,
): Types.Helix.Routes<S, A> {
  return Object.keys(routes)
    .map(key => {
      let route = routes[key]
      return {
        [key]: fn(key, route),
      }
    })
    .reduce(combineObjects, {})
}

function createModel<S, A>(
  model: Types.Helix.Model<any, any, any>,
  routes: Types.Helix.Routes<S, A> | undefined,
  render: () => void,
) {
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

function parseQueryFromLocation(query: string): Types.Params {
  return query.length ? qs.parse(query.slice(1)) : {}
}

function stringifyQueryFromLocation(query?: Types.Params): string {
  return query ? `?${qs.stringify(query, { encode: false })}` : ''
}

function location(
  rerender: Types.Render,
): Types.Helix.Model<Types.LocationState, Types.LocationReducers, Types.LocationEffects> {
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

export default function helix<S, A>(
  configuration: Types.Helix.Config<S, A>,
): Types.Twine.Return<S, A> {
  const routes = configuration.routes ? wrap<S, A>(configuration.routes, wrapRoutes) : null
  const notFound =
    configuration.routes && configuration.routes.notFound
      ? configuration.routes.notFound
      : () => null as () => null
  const router = rlite(notFound, routes)
  const model = createModel<S, A>(configuration.model, configuration.routes, renderCurrentLocation)
  const plugins = [onStateChange as Twine.Plugin<S, A>].concat(configuration.plugins || [])
  const store = twine<S, A>(model, plugins)
  const render = configuration.render

  let currentState = store.state as Types.Helix.HelixState<S>
  let previousState = store.state as Types.Helix.HelixState<S>
  let currentActions = store.actions as Types.Helix.HelixActions<A>
  let subscribe = store.subscribe
  let onLeaveHook: Types.Helix.Component<S, A>
  let currentLocation: Types.Helix.Route<S, A>

  function rerender(node: any) {
    if (node) {
      render(node, currentState, previousState, currentActions)
    }
  }

  function onStateChange(
    newState: Types.Helix.HelixState<S>,
    newPrev: Types.Helix.HelixState<S>,
    newActions: Types.Helix.HelixActions<A>,
  ) {
    currentState = newState
    previousState = newPrev
    currentActions = newActions
    renderCurrentLocation()
  }

  function getComponent(path: string) {
    if (configuration.routes) {
      return router(path)
    } else {
      return configuration.component ? configuration.component : null
    }
  }

  function lifecycle(newLocation: Types.Helix.Route<S, A>) {
    if (typeof newLocation !== 'function') {
      if (currentLocation === newLocation) {
        if (newLocation.onUpdate) {
          newLocation.onUpdate(currentState, previousState, currentActions)
        }
      } else {
        if (newLocation.onEnter) {
          newLocation.onEnter(currentState, previousState, currentActions)
        }
      }
    }
    if (onLeaveHook) {
      onLeaveHook(currentState, previousState, currentActions)
    }
    onLeaveHook = typeof newLocation !== 'function' ? newLocation.onLeave : undefined
    currentLocation = newLocation
  }

  function wrapRoutes(route: any, newLocation: Types.Helix.Route<S, A>) {
    // Route isn't used??? Check what it is...
    return function(params: Record<string, string>, _: any, pathname: string) {
      const differentRoute = currentState.location.pathname !== pathname
      const differentQuery =
        stringifyQueryFromLocation(currentState.location.query) !== (window.location.search || '?')
      if (differentRoute || differentQuery) {
        currentActions.location.receiveRoute({
          pathname,
          query: parseQueryFromLocation(window.location.search),
          params,
        })
        lifecycle(newLocation)
        onLeaveHook = typeof newLocation !== 'function' ? newLocation.onLeave : undefined
        return false
      }
      return typeof newLocation === 'object' ? newLocation.view : newLocation
    }
  }

  function renderCurrentLocation() {
    rerender(getComponent(window.location.pathname))
  }

  function setLocationAndRender(location: Window['location']): void {
    const search = Object.keys(location.search).length
      ? `?${qs.stringify(location.search, { encode: false })}`
      : ''
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
