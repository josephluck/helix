import api from '../../api'

function defaultState () {
  return {
    posts: [],
  }
}

export default function model () {
  return {
    scoped: true,
    state: defaultState(),
    reducers: {
      resetState (state) {
        return defaultState()
      },
      receivePosts (state, posts) {
        return {
          posts,
        }
      }
    },
    effects: {
      requestPosts (state, actions) {
        api.fetchPosts().then(actions.receivePosts)
      },
    },
  }
}
