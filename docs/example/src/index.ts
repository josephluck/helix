import helix from '../../../src'
import model from './model'
import pages from './pages'
import * as html from 'yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

function renderer(dom) {
  let _dom = dom
  return function (node, state, prev, actions) {
    if (node) {
      _dom = html.update(_dom, node(state, prev, actions))
    }
  }
}

helix({
  model: model(),
  routes: pages(),
  render: renderer(mount),
})
