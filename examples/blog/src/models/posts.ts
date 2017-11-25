import { Helix } from '../../../../src'
import api from '../api'
import { Post } from '../api/fixtures/post'
import { GlobalState, GlobalActions } from './'

export interface State {
  posts: Post[]
}

export interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePosts: Helix.Reducer<State, Post[]>
}

export interface Effects {
  requestPosts: Helix.Effect0<GlobalState, GlobalActions>
}

export type Actions = Helix.Actions<Reducers, Effects>

export function model(): Helix.Model<State, Reducers, Effects> {
  return {
    state: {
      posts: [],
    },
    reducers: {
      resetState() {
        return { posts: [] }
      },
      receivePosts(state, posts) {
        return { posts }
      },
    },
    effects: {
      async requestPosts(state, actions) {
        const posts = await api.fetchPosts()
        actions.posts.receivePosts(posts)
      },
    },
  }
}
