import { Helix } from '../../../../src'
import api from '../api'
import { Post } from '../api/fixtures/post'

export interface State {
  posts: Post[]
}

export interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePosts: Helix.Reducer<State, Post[]>
}

export interface Effects {
  requestPosts: Helix.Effect0<State, Actions>
}

export type Actions = Helix.Actions<Reducers, Effects>

function resetState(): State {
  return {
    posts: [],
  }
}

export function model(): Helix.Model<State, Reducers, Effects> {
  return {
    scoped: true,
    state: resetState(),
    reducers: {
      resetState,
      receivePosts(state, posts) {
        return { posts }
      },
    },
    effects: {
      requestPosts(state, actions) {
        api.fetchPosts().then(actions.receivePosts)
      },
    },
  }
}
