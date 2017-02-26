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

// Takes Twine.Model and returns a Twine.Model
function makeModel (model: Twine.Model): Twine.Model {
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
    let model = makeModel(configuration.model)
    let routes = wrapRoutes(configuration.routes, wrapper)
    let router = rlite(() => null, routes)
    let store = twine(subscribe)(model)

    let _state = store.state
    let _prev = store.state
    let _actions = store.actions

    function wrapper (route, handler): Helix.RLiteHandler {
      let currentPath = window.location.pathname
      return function (params, _, newPath) {
        if (currentPath !== newPath) {
          currentPath = newPath
          store.actions.location.set({ pathname: newPath, params })
        }
        return handler
      }
    }

    function render (state, prev, actions, vnode) {
      const props = { state, prev, actions }
      return morph(props, vnode)
    }

    function subscribe (state, prev, actions) {
      _state = state
      _prev = prev
      _actions = actions
      return render(state, prev, actions, router(window.location.pathname))
    }

    href(function (path) {
      store.actions.location.updateUrl({pathname: path.pathname})
      render(_state, _state, _actions, router(path.pathname))
    })

    render(store.state, store.state, store.actions, router(store.state.location.pathname))
  }
}
