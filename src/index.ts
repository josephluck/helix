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

function wrapRoutes (routes: Helix.Routes, wrap: Helix.RouteWrapper): Helix.Routes {
  return Object.keys(routes).map(route => {
    let handler = routes[route]
    return {
      [route]: wrap(route, handler),
    }
  }).reduce(combineObjects, {})
}

export default function (configuration) {
  return function mount (mount: Helix.Mount): void {
    let morph = renderer(mount)
    let model = configuration.model
    let routes = configuration.routes ? wrapRoutes(configuration.routes, decorateRoutesInLocationHandler) : null
    let renderView = configuration.routes ? rlite(() => null, routes) : null
    let renderComponent = configuration.component ? configuration.component : null

    if (configuration.routes) {
      model.models.location = location(renderCurrentLocation)
    }

    let store = twine(onStateChange)(model)
    let _state = store.state
    let _prev = store.state
    let _actions = store.actions

    href(setLocationAndRender)
    window.onpopstate = renderCurrentLocation
    renderCurrentLocation()

    function renderCurrentLocation () {
      let component = renderView ? renderView(window.location.pathname) : renderComponent
      renderPage(component)
    }

    function decorateRoutesInLocationHandler (route, handler) {
      return function (params, _, pathname) {
        let _handler = handler
        if (_state.location.pathname !== pathname) {
          _actions.location.receiveRoute({ pathname, params })
          return false
        }
        if (typeof _handler === 'object') {
          _handler = function () {
            const props = { state: _state, prev: _prev, actions: _actions }
            function createArgs (args) {
              return Array.prototype.slice.call(args).concat([_state, _prev, _actions])
            }
            function createBinding (binding) {
              if (!binding) {
                return null
              }
              return function () {
                binding.apply(null, createArgs(arguments))
              }
            }
            return createElement(handler.view, Object.assign({}, props, {
              onComponentWillMount: createBinding(handler.onWillMount),
              onComponentDidMount: createBinding(handler.onDidMount),
              onComponentShouldUpdate: createBinding(handler.onShouldUpdate),
              onComponentWillUpdate: createBinding(handler.onWillUpdate),
              onComponentDidUpdate: createBinding(handler.onDidUpdate),
              onComponentWillUnmount: createBinding(handler.onWillUnmount),
            }))
          }
        }
        return _handler
      }
    }

    function renderPage (vnode): void {
      const props = { state: _state, prev: _prev, actions: _actions }
      if (vnode) {
        let _vnode
        _vnode = vnode
        morph(props, _vnode)
      }
    }

    function onStateChange (state, prev, actions): void {
      _state = state
      _prev = prev
      _actions = actions
      let component = renderView ? renderView(window.location.pathname) : renderComponent
      renderPage(component)
    }

    function setLocationAndRender (path): void {
      window.history.pushState('', '', path.pathname)
      renderPage(renderView ? renderView(path.pathname) : null)
    }
  }
}
