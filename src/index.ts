import * as rlite from 'rlite-router'
import * as href from 'sheet-router/href'
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

function addLocationModel (model: Twine.Model): Twine.Model {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: location(window),
    }),
  })
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

export default function (configuration: Helix.Configuration) {
  return function mount (mount: Helix.Mount): void {
    let morph = renderer(mount)
    let model = configuration.routes ? addLocationModel(configuration.model) : configuration.model
    let routes = configuration.routes ? wrapRoutes(configuration.routes, wrapper) : null
    let renderView = configuration.routes ? rlite(() => null, routes) : null
    let renderComponent = configuration.component ? configuration.component : null
    let store = twine(subscribe)(model)

    let _state = store.state
    let _prev = store.state
    let _actions = store.actions
    let _pathname = window.location.pathname

    function wrapper (route, handler): Helix.RLiteHandler {
      return function (params, _, pathname) {
        if (_pathname !== pathname) {
          _pathname = pathname
          store.actions.location.receiveRoute({ pathname, params })
          return false
        }
        return handler
      }
    }

    function render (state, prev, actions, vnode: false | Helix.View) {
      const props = { state, prev, actions }
      if (vnode) {
        return morph(props, vnode)
      }
    }

    function subscribe (state, prev, actions) {
      _state = state
      _prev = prev
      _actions = actions
      return render(state, prev, actions, renderView ? renderView(window.location.pathname) : renderComponent)
    }

    href(function (path) {
      store.actions.location.set(path.pathname)
      render(_state, _state, _actions, renderView ? renderView(path.pathname) : null)
    })

    window.onpopstate = function () {
      render(_state, _state, _actions, renderView ? renderView(window.location.pathname) : null)
    }

    render(_state, _state, _actions, renderView ? renderView(window.location.pathname) : renderComponent)
  }
}
