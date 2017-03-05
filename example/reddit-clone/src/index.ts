require('es6-shim')
import helix from '../../../src'
import model from './model'
import routes from './routes'

const app = helix({ model: model(), routes: routes() })

const node = document.createElement('div')
document.body.appendChild(node)
app(node)
