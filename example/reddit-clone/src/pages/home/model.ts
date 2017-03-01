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
      receivePosts (state, posts) {
        console.log(posts)
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
