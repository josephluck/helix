import * as rlite from 'rlite-router'
import * as href from 'sheet-router/href'
import * as tansu from 'tansu'
import html from './html'
import location from './location'
import { Sakura } from './types'

function renderer (mount) {
  let curr
  return function (props, vnode) {
    curr = html.render(html.h(vnode, props), mount, curr)
  }
}

// Takes Tansu.Model and returns a Tansu.Model
function makeModel (model) {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: location(window),
    }),
  })
}

function combineObjects (a, b) {
  return Object.assign({}, a, b)
}

function wrapRoutes (routes, wrap) {
  return Object.keys(routes).map(key => {
    let route = routes[key]
    return {
      [key]: wrap(key, route),
    }
  }).reduce(combineObjects, {})
}

export default function (configuration) {
  return function mount (mount) {
    let morph = renderer(mount)
    let model = makeModel(configuration.model)
    let routes = wrapRoutes(configuration.routes, wrapper)
    let router = rlite(() => null, routes)
    let store = tansu(subscribe)(model)

    let _state = store.state
    let _prev = store.prev
    let _methods = store.methods

    function wrapper (route, handler) {
      let currentPath = window.location.pathname
      return function (params, _, newPath) {
        if (currentPath !== newPath) {
          currentPath = newPath
          store.methods.location.set({ pathname: newPath, params })
        }
        return handler
      }
    }

    function render (state, prev, methods, vnode) {
      const props = { state, prev, methods }
      return morph(props, vnode)
    }

    function subscribe (state, prev, methods) {
      _state = state
      _prev = prev
      _methods = methods
      return render(state, prev, methods, router(window.location.pathname))
    }

    href(function (path) {
      store.methods.location.updateUrl({pathname: path.pathname})
      render(_state, _state, _methods, router(path.pathname))
    })

    render(store.state, store.state, store.methods, router(store.state.location.pathname))
  }
}
