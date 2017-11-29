import * as Types from '../types'
import * as html from 'yo-yo'

export default function renderer(dom: HTMLElement): Types.Helix.Renderer<any, any> {
  let _dom = dom
  return function(node, state, prev, actions) {
    if (node) {
      _dom = html.update(_dom, node(state, prev, actions))
    }
  }
}
