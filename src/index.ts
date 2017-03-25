import * as rlite from 'rlite-router'
import * as href from 'sheet-router/href'
import * as qs from 'qs'
import twine from 'twine-js'

function combineObjects (a, b) {
  return Object.assign({}, a, b)
}

function wrap (routes, fn) {
  return Object.keys(routes).map(key => {
    let route = routes[key]
    return {
      [key]: fn(key, route),
    }
  }).reduce(combineObjects, {})
}

function createModel (model, routes, render) {
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

function getQueryFromLocation (search) {
  return search.length ? qs.parse(search.slice(1)) : {}
}

function location (rerender) {
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

export default function (configuration) {
  const routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null
  const notFound = configuration.routes && configuration.routes.notFound ? configuration.routes.notFound : () => null
  const router = rlite(notFound, routes)
  const model = createModel(configuration.model, configuration.routes, renderCurrentLocation)
  const store = twine(onStateChange)(model)
  const render = configuration.render

  let _state = store.state
  let _prev = store.state
  let _actions = store.actions
  let _onLeave
  let _handler

  function rerender (node) {
    render(node, _state, _prev, _actions)
  }

  function onStateChange (state, prev, actions) {
    _state = state
    _prev = prev
    _actions = actions
    rerender(getComponent(window.location.pathname))
  }

  function getComponent (path) {
    if (configuration.routes) {
      return router(path)
    } else {
      return configuration.component ? configuration.component : null
    }
  }

  function lifecycle (handler) {
    if (_handler === handler) {
      if (handler.onUpdate) {
        handler.onUpdate(_state, _prev, _actions)
      }
    } else {
      _handler = handler
      if (_onLeave) {
        _onLeave(_state, _prev, _actions)
        _onLeave = handler.onLeave
      }
      if (handler.onEnter) {
        handler.onEnter(_state, _prev, _actions)
      }
    }
  }

  function wrapRoutes (route, handler) {
    let view = typeof handler === 'object' ? handler.view : handler
    return function (params, _, pathname) {
      if (_state.location.pathname !== pathname) {
        let query = getQueryFromLocation(window.location.search)
        _actions.location.receiveRoute({ pathname, params: Object.assign({}, params, query) })
        lifecycle(handler)
        _onLeave = handler.onLeave
        return false
      }
      return view
    }
  }

  function renderCurrentLocation () {
    rerender(getComponent(window.location.pathname))
  }

  function setLocationAndRender (location): void {
    const search = Object.keys(location.search).length ? `?${qs.stringify(location.search, {encode: false})}` : ''
    const path = `${location.pathname}${search}`
    window.history.pushState('', '', path)
    rerender(getComponent(location.pathname))
  }

  href(setLocationAndRender)
  window.onpopstate = renderCurrentLocation
  renderCurrentLocation()
}
