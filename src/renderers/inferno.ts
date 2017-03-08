import inferno from 'inferno'
import * as h from 'inferno-create-element'

export default h

export function renderer (dom) {
  let _dom = dom
  return function (node, state, prev, actions) {
    if (node) {
      inferno.render(node(state, prev, actions), _dom)
    }
  }
}
