import helix from '../../../src'
import model from './model'
import pages from './pages'

const app = helix({ model: model(), routes: pages() })

const node = document.createElement('div')
document.body.appendChild(node)
app(node)
