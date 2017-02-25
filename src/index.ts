import * as sheetRouter from 'sheet-router'
import * as walk from 'sheet-router/walk'
import html from './html'
import cycle from './cycle'
import location, { walker } from './location'
import { Sakura } from './types'

function renderer (mount: HTMLElement) {
  let prev
  return function (props: any, child: Sakura.View) {
    prev = html.render(html.h(child, props), mount, prev)
  }
}

// Takes Tansu.Model and returns a Tansu.Model
function makeModel (model: any): any {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: location(window),
    }),
  })
}

export default function (configuration: Sakura.Configuration) {
  return function (mount: HTMLElement) {
    let morph = renderer(mount)
    let model = makeModel(configuration.model)
    let router = sheetRouter({ thunk: false }, configuration.routes)
    walk(router, walker)
    return cycle(morph, model, router)
  }
}
