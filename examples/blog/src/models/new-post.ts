import { Helix } from '../../../../src' // 'helix-js'
import api from '../api'
import * as Form from './form'
import { GlobalState, GlobalActions } from './'

export interface Fields {
  title: string
  body: string
}

export interface LocalState {}

export interface State extends LocalState {
  form: Form.State<Fields>
}

export interface Reducers {
  resetState: Helix.Reducer0<LocalState>
}

export interface Effects {
  submit: Helix.Effect0<GlobalState, GlobalActions>
}

export type LocalActions = Helix.Actions<Reducers, Effects>

export interface Actions extends LocalActions {
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
        const { title, body } = state.newPost.form
        return api
          .newPost(title, body)
          .then(post => {
            actions.location.set(`/posts/${post.uuid}`)
            actions.alert.showSuccess('Post saved')
          })
          .catch(actions.alert.showError)
      },
    },
    models: {
      form: Form.model<Fields>({
        title: '',
        body: '',
      }),
    },
  }
}
