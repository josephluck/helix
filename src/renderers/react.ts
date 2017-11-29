import * as Types from '../types'
import * as dom from 'react-dom'

export default function renderer(elm: HTMLElement): Types.Helix.Renderer<any, any> {
  return function(node, state, previous, actions) {
    if (node) {
      dom.render(node(state, previous, actions), elm)
    }
  }
}
