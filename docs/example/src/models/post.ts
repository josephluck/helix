import { Helix } from '../../../../src'
import { GlobalState, GlobalActions } from './'
import api from '../api'
import * as Form from './form'



export interface Post {
  title: string
  body: string
  comments: Comment[]
}

export interface State {
  post: null | Post
}

export interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePost: Helix.Reducer<State, Post>
  receiveComment: Helix.Reducer<State, Post>
}

function resetState(): State {
  return {
    post: null,
  }
}

export function model() {
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
        api.newComment(comment, state.user.user)
          .then(response => {
            actions.post.form.setField({ key: 'comment', value: ' ' })
            actions.post.receiveComment(response)
          })
      },
    },
    models: {
      form: Form.model({}),
    },
  }
}
