import { Helix } from '../../../../src'
import * as Form from './form'
import { User } from '../api/fixtures/user'
import { GlobalState, GlobalActions } from './'

export interface Fields {
  name: string
  username: string
  password: string
}

export interface LocalState {}

export interface State extends LocalState {
  form: Form.State<Fields>
}

export interface Reducers {}

export interface Effects {
  init: Helix.Effect<GlobalState, GlobalActions, User>
}

export type LocalActions = Helix.Actions<Reducers, Effects>

export interface Actions extends LocalActions {
  form: Form.Actions<Fields>
}

export function model(): Helix.Model<LocalState, Reducers, Effects> {
  return {
    state: {},
    reducers: {},
    effects: {
      init(state, actions, user) {
        return actions.settings.form.setForm(user)
      },
    },
    models: {
      form: Form.model({
        name: '',
        username: '',
        password: '',
      }),
    },
  }
}
