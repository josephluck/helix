import api from '../../api'

function defaultState () {
  return {
    post: null,
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
      receivePost (state, post) {
        return {
          post,
        }
      }
    },
    effects: {
      requestPost (state, actions) {
        api.fetchPost().then(actions.receivePost)
      },
    },
  }
}
