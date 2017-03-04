// Please note that the inelegance of this file is for the sake of performance
import * as rlite from 'rlite-router'
import * as href from 'sheet-router/href'
import * as createElement from 'inferno-create-element/dist/inferno-create-element'
import twine from 'twine-js'
import { Twine } from 'twine-js/dist/types'

import html from './html'
import location from './location'
import { Helix } from './types'

function renderer (mount: HTMLElement): Helix.Renderer {
  return function (props: Helix.Props, vnode) {
    html.render(vnode(props), mount)
  }
}

function combineObjects (a, b) {
  return Object.assign({}, a, b)
}

function wrap (routes: Helix.Routes, wrap: Helix.RouteWrapper): Helix.Routes {
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
  return function mount (mount: Helix.Mount): void {
    const morph = renderer(mount)
    const routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null
    const router = rlite(() => null, routes)
    const model = createModel(configuration, renderCurrentLocation)
    const store = twine(onStateChange)(model)

    let _state = store.state
    let _prev = store.state
    let _actions = store.actions

    function onStateChange (state, prev, actions): void {
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

    function applyHook (hook, defer = false) {
      if (!hook) {
        return null
      }
      return function () {
        let args = [_state, _prev, _actions]
        if (defer) {
          window.requestAnimationFrame(() => hook.apply(null, args))
        } else {
          hook.apply(null, args)
        }
      }
    }

    function wrapRoutes (route, handler) {
      let _handler = handler
      if (typeof _handler === 'object') {
        _handler = function () {
          let props = Object.assign({}, getProps(), {
            onComponentDidMount: applyHook(handler.onMount),
            onComponentWillUnmount: applyHook(handler.onUnmount, true),
          })
          return createElement(handler.view, props)
        }
      }
      return function (params, _, pathname) {
        if (_state.location.pathname !== pathname) {
          _actions.location.receiveRoute({ pathname, params })
          return false
        }
        return _handler
      }
    }

    function rerender (vnode): void {
      if (vnode) {
        morph(getProps(), vnode)
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
