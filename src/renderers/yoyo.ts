import * as yoyo from 'yo-yo'

export default yoyo

export function renderer (dom) {
  let _dom = dom
  return function (node, state, prev, actions) {
    if (node) {
      _dom = yoyo.update(_dom, node(state, prev, actions))
    }
  }
}
