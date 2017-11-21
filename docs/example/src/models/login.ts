import { Helix } from '../../../../src'
import { GlobalState, GlobalActions } from './'
import api from '../api'
import * as Form from './form'
import user from '../api/fixtures/user'

let currentUser = user() // mock out authenticated user

export interface Fields {
  username: string
  password: string
  name: string
  avatar: string
}

export interface LocalState { }

export interface State {
  form: Form.State<Fields>
}

export interface Reducers {
  resetState: Helix.Reducer0<State>
}

export interface Effects {
  submit: Helix.Effect0<GlobalState, GlobalActions>
  logout: Helix.Effect0<GlobalState, GlobalActions>
}

export type LocalActions = Helix.Actions<Reducers, Effects>

export interface Actions {
  form: Form.Actions<Fields>
}

export function model(): Helix.Model<LocalState, Reducers, Effects> {
  return {
    state: {},
    reducers: {
      resetState() {
        return {}
      },
    },
    effects: {
      submit(state, actions) {
        let { username, password } = state.login.form
        return api.login(currentUser, username, password)
          .then(resp => {
            actions.alert.showSuccess(`Hey, ${resp.user.name}!`)
            actions.user.receiveUser(resp.user)
            actions.location.set(state.location.query.redirect || '/')
          }, err => actions.alert.showError(err))
      },
      logout(state, actions) {
        actions.location.set('/')
        actions.alert.showSuccess(`See you soon, ${state.user.user.name}`)
        actions.user.resetState()
      },
    },
    models: {
      form: Form.model(Object.assign({}, currentUser, {})),
    },
  }
}
