import { Twine } from 'twine-js'
export { Twine } from 'twine-js'

export interface LocationState {
  pathname: string
  params: Record<string, string>
  query: Record<string, string>
}

export interface LocationReducers {
  receiveRoute: Twine.Reducer<LocationState, LocationState>
}

export interface LocationEffects {
  set: Twine.Effect<State, Actions, string>
}

export interface State {
  location: LocationState
}

export interface Actions {
  location: Twine.Actions<LocationReducers, LocationEffects>
}

export type Render = (pathname: string) => any

export namespace Helix {
  // State types
  export type Model<S, R, E> = Twine.Model<S, R, E>
  export type ModelApi<S, A> = Twine.ModelApi<S, A>
  export type Plugin<S, A> = Twine.Plugin<S, A>
  export type Subscriber<S, A> = Twine.Subscriber<S, A>
  export type Reducer0<S> = Twine.Reducer0<S>
  export type Reducer<S, P = any> = Twine.Reducer<S, P>
  export type Effect0<S, A, R = void> = Twine.Effect0<S, A, R>
  export type Effect<S, A, P = any, R = void> = Twine.Effect<S, A, P, R>
  export type Actions<S, R> = Twine.Actions<S, R>

  // View types

  // Router types

  // Config
  export interface Config<S, A> {
    model: Twine.Model<any, any, any>
    routes?: any
    component?: any
    render: (node: any, state: S, previous: S, actions: A) => any
    plugins?: Twine.Plugin<S, A>[]
  }
}
