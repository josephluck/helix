import { Twine as Helix } from 'twine-js'

export namespace Helix {
  export interface LocationState {
    pathname: string
    params: Record<string, string>
    query: Record<string, string>
  }

  export interface LocationReducers {
    receiveRoute: Helix.Reducer<LocationState, LocationState>
  }

  export interface LocationEffects {
    set: Helix.Effect<State, Actions, string>
  }

  export interface State {
    location: LocationState
  }

  export interface Actions {
    location: Helix.Actions<LocationReducers, LocationEffects>
  }
}
