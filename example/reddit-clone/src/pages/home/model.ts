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
        return {
          posts,
        }
      }
    },
    effects: {
      requestPosts (state, actions) {
        setTimeout(() => {
          actions.receivePosts([
            'Post 1',
            'Post 2',
            'Post 3',
          ])
        }, 1000)
      },
    },
  }
}
