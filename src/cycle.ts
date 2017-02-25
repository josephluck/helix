import * as tansu from 'tansu'
import * as href from 'sheet-router/href'
import { Sakura } from './types'

export default function (renderer: Sakura.Renderer, model: any, router: Sakura.RouterRenderer) {
  function render (state: any, prev: any, methods: any, child: Sakura.View) {
    const props = {
      state: state,
      prev: prev,
      methods: methods,
    }
    return renderer(props, child)
  }

  function subscribe (state: any, prev: any, methods: any) {
    return render(state, prev, methods, router(state.location.pathname))
  }

  const store = tansu(subscribe)(model)

  href(function (path: Sakura.RouterPath) {
    store.methods.location.set(path.pathname)
  })

  render(store.state, store.state, store.methods, router(store.state.location.href))
}
