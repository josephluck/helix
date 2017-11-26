import { Helix } from '../../../../src'
import { User } from '../api/fixtures/user'

export interface State {
  user: User | null
}

export interface Reducers {
  resetState: Helix.Reducer0<State>
  receiveUser: Helix.Reducer<State, User>
}

export interface Effects {}

export type Actions = Helix.Actions<Reducers, Effects>

function defaultState() {
  return {
    user: null,
  }
}

export function model(): Helix.Model<State, Reducers, Effects> {
  return {
    state: defaultState(),
    reducers: {
      resetState() {
        return defaultState()
      },
      receiveUser(state, user) {
        return { user }
      },
    },
  }
}
