import { Twine } from 'twine-js'
export { Twine } from 'twine-js'

export type Params = Record<string, string>

export interface LocationState {
  pathname: string
  params: Params
  query: Params
}

export interface LocationReducers {
  receiveRoute: Twine.Reducer<LocationState, LocationState>
}

export interface LocationEffects {
  set: Twine.Effect<LocationState, LocationActions, string>
}

export type LocationActions = Twine.Actions<LocationReducers, LocationEffects>

export type Render = (pathname: string) => any

export namespace Helix {
  // State types
  export type HelixState<S> = S & { location: LocationState }
  export type HelixActions<A> = A & { location: LocationActions }
  export type Model<S, R, E> = Twine.Model<S, R, E>
  export type ModelApi<S, A> = Twine.ModelApi<S, A>
  export type Plugin<S, A> = Twine.Plugin<S, A>
  export type Subscriber<S, A> = Twine.Subscriber<S, A>
  export type Reducer0<S> = Twine.Reducer0<S>
  export type Reducer<S, P = any> = Twine.Reducer<S, P>
  export type Effect0<S, A, R = void> = Twine.Effect0<S, A, R>
  export type Effect<S, A, P = any, R = void> = Twine.Effect<S, A, P, R>
  export type Actions<R, E> = Twine.Actions<R, E>
  export type Models<M> = Twine.Models<M>

  // View types
  export type Component<S, A> = (state: S, previous: S, actions: A) => any
  export interface Page<S, A> {
    onEnter?: Component<S, A>
    onUpdate?: Component<S, A>
    onLeave?: Component<S, A>
    view: Component<S, A>
  }

  // Router types
  export type Route<S, A> = Component<S, A> | Page<S, A>
  export type Routes<S, A> = Record<string, Route<S, A>>

  // Config
  export type Renderer<S, A> = (node: any, state: S, previous: S, actions: A) => any

  export interface Config<S, A> {
    model: Twine.Model<any, any, any>
    routes?: Routes<S, A>
    component?: Component<S, A>
    render: Renderer<S, A>
    plugins?: Twine.Plugin<S, A>[]
  }
}
