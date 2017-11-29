import { Helix } from '../../../../src' // 'helix-js'
import api from '../api'
import * as Form from './form'
import { Comment } from '../api/fixtures/comment'
import { Post } from '../api/fixtures/post'
import { GlobalActions, GlobalState } from './'

export interface Fields {
  comment: string
}

export interface LocalState {
  post: null | Post
}

export interface State extends LocalState {
  form: Form.State<Fields>
}

export interface Reducers {
  resetState: Helix.Reducer0<LocalState>
  receivePost: Helix.Reducer<LocalState, Post>
  receiveComment: Helix.Reducer<LocalState, Comment>
}

export interface Effects {
  requestPost: Helix.Effect0<GlobalState, GlobalActions>
  submitComment: Helix.Effect<GlobalState, GlobalActions, string>
}

export type LocalActions = Helix.Actions<Reducers, Effects>

export interface Actions extends LocalActions {
  form: Form.Actions<Fields>
}

function resetState(): LocalState {
  return {
    post: null,
  }
}

export function model(): Helix.Model<LocalState, Reducers, Effects> {
  return {
    state: resetState(),
    reducers: {
      resetState,
      receivePost(state, post) {
        return { post }
      },
      receiveComment(state, comment) {
        return {
          post: {
            ...state.post,
            comments: [comment].concat(state.post.comments),
          },
        }
      },
    },
    effects: {
      requestPost(state, actions) {
        api.fetchPost().then(actions.post.receivePost)
      },
      submitComment(state, actions, comment) {
        api.newComment(comment, state.user.user).then(response => {
          actions.post.form.setField({ key: 'comment', value: ' ' })
          actions.post.receiveComment(response)
        })
      },
    },
    models: {
      form: Form.model({
        comment: '',
      }),
    },
  }
}
