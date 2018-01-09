import { Twine } from 'twine-js'
export { Twine } from 'twine-js'

export type Params = Record<string, string>

export interface LocationState {
  name: string
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
  export type HelixState<State> = State & { location: LocationState }
  export type HelixActions<Actions> = Actions & { location: LocationActions }
  export type Model<State, Reducers, Effects> = Twine.Model<State, Reducers, Effects>
  export type ModelApi<State, Actions> = Twine.ModelApi<State, Actions>
  export type Plugin<State, Actions> = Twine.Plugin<State, Actions>
  export type Subscriber<State, Actions> = Twine.Subscriber<State, Actions>
  export type Reducer0<State> = Twine.Reducer0<State>
  export type Reducer<State, Payload> = Twine.Reducer<State, Payload>
  export type Effect0<Statetate, Actions, Return = void> = Twine.Effect0<Statetate, Actions, Return>
  export type Effect<State, Actions, Payload, Return = void> = Twine.Effect<
    State,
    Actions,
    Payload,
    Return
  >
  export type Actions<Reducers, Effects> = Twine.Actions<Reducers, Effects>
  export type Models<Models> = Twine.Models<Models>

  // View types
  export type Component<State, Actions> = (state: State, previous: State, actions: Actions) => any
  export interface Page<State, Actions> {
    onEnter?: Component<State, Actions>
    onUpdate?: Component<State, Actions>
    onLeave?: Component<State, Actions>
    view: Component<State, Actions>
  }

  // Router types
  export type Route<State, Actions> = Component<State, Actions> | Page<State, Actions>
  export type Routes<State, Actions> = Record<string, Route<State, Actions>>

  // Config
  export type Renderer<State, Actions> = (
    node: Component<State, Actions>,
    state: State,
    previous: State,
    actions: Actions,
  ) => any

  export interface Config<State, Actions> {
    model: Twine.Model<any, any, any>
    routes?: Routes<State, Actions>
    component?: Component<State, Actions>
    render: Renderer<State, Actions>
    plugins?: Twine.Plugin<State, Actions>[]
  }
}
