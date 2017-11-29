import helix from '../../../src' // 'helix-js'
import renderer from '../../../src/renderers/yo-yo' // 'helix-js/renderers/yo-yo'
import model, { GlobalState, GlobalActions } from './models'
import pages from './pages'

const mount = document.createElement('div')
document.body.appendChild(mount)

helix<GlobalState, GlobalActions>({
  model: model(),
  routes: pages(),
  render: renderer(mount),
})
