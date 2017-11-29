import helix, { Helix } from '../../../src'
import model, { GlobalState, GlobalActions } from './models'
import pages from './pages'
import * as html from 'yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

function renderer(dom): Helix.Renderer<GlobalState, GlobalActions> {
  let _dom = dom
  return function(node, state, prev, actions) {
    if (node) {
      _dom = html.update(_dom, node(state, prev, actions))
    }
  }
}

helix<GlobalState, GlobalActions>({
  model: model(),
  routes: pages(),
  render: renderer(mount),
})
