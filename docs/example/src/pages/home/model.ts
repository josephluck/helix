import api from '../../api'

function resetState() {
  return {
    posts: [],
  }
}

export default function model() {
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
