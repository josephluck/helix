import * as Types from '../types'

export default function renderer(dom: HTMLElement): Types.Helix.Renderer<any, any> {
  return function(node, state, prev, actions) {
    if (node) {
      dom.innerHTML = node(state, prev, actions)
    }
  }
}
