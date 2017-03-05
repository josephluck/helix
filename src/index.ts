// Please note that the inelegance of this file is for the sake of performance
import * as rlite from 'rlite-router'
import * as href from 'sheet-router/href'
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

export default function (configuration) {
  return function mount (mount) {
    const routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null
    const router = rlite(() => null, routes)
    const model = createModel(configuration, renderCurrentLocation)
    const store = twine(onStateChange)(model)

    let _dom = mount
    function rerender (node) {
      if (node) {
        _dom = html.update(_dom, node(getProps()))
      }
    }

    let _state = store.state
    let _prev = store.state
    let _actions = store.actions

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

    function getProps () {
      return { state: _state, prev: _prev, actions: _actions }
    }

    function applyHook (hook) {
      if (!hook) {
        return null
      }
      return function () {
        let args = [_state, _prev, _actions]
        window.requestAnimationFrame(() => hook.apply(null, args))
      }
    }

    let _onLeave
    function lifecycle (oldHandler, newHandler) {
      if (oldHandler === newHandler) {
        if (newHandler.onUpdate) {
          newHandler.onUpdate(_state, _prev, _actions)
        }
      } else {
        if (_onLeave) {
          _onLeave(_state, _prev, _actions)
        }
        if (newHandler.onEnter) {
          newHandler.onEnter(_state, _prev, _actions)
        }
      }
      _onLeave = newHandler.onLeave
    }

    let _handler
    function wrapRoutes (route, handler) {
      let view = handler
      if (typeof view === 'object') {
        view = handler.view
      }
      return function (params, _, pathname) {
        if (_state.location.pathname !== pathname) {
          lifecycle(_handler, handler)
          _actions.location.receiveRoute({ pathname, params })
          return false
        }
        _handler = handler
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
}
