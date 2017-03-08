// Please note that the inelegance of this file is for the sake of performance
import * as rlite from 'rlite-router'
import * as href from 'sheet-router/href'
import * as qs from 'query-string-json'
import twine from 'twine-js'
import html from './html'
import location from './location'

function combineObjects (a, b) {
  return Object.assign({}, a, b)
}

function wrap (routes, wrap) {
  return Object.keys(routes).map(route => {
    let handler = routes[route]
    return {
      [route]: wrap(route, handler),
    }
  }).reduce(combineObjects, {})
}

function createModel (configuration, render) {
  let model = configuration.model
  if (configuration.routes) {
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

function getQueryFromLocation (location) {
  let query = qs.parse(location)
  if (query) {
    return Object.keys(query).map(key => {
      return { [key]: query[key][0] }
    }).reduce((curr, prev) => Object.assign({}, prev, curr))
  }
  return {}
}

export default function (configuration) {
  const routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null
  const router = rlite(() => null, routes)
  const model = createModel(configuration, renderCurrentLocation)
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
        let query = getQueryFromLocation(window.location.href)
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

  function setLocationAndRender (path): void {
    window.history.pushState('', '', path.pathname)
    rerender(getComponent(path.pathname))
  }

  href(setLocationAndRender)
  window.onpopstate = renderCurrentLocation
  renderCurrentLocation()
}
