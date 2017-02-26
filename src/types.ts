import * as Inferno from 'inferno/dist-es/index'
import { Twine } from 'twine-js/dist/types'

export namespace Helix {
  export interface Props {
    state: any
    prev: any
    methods: Twine.Methods
  }
  export interface Routes {
    [key: string]: View
  }

  export type View = (props: Props) => Inferno.VNode
  export type RLiteHandler = (params, state, newPath) => View
  export type RouteWrapper = (route: string, handler: View) => RLiteHandler
  export type Renderer = (props: Props, vnode) => void

  export interface Configuration {
    model: Twine.Model
    routes: Routes
  }
  export type Mount = HTMLElement
}
