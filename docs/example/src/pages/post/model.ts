import api from '../../api'

import form from '../../model/form'

function resetState() {
  return {
    post: null,
  }
}

export default function model() {
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
        api.fetchPost().then(actions.pages.post.receivePost)
      },
      submitComment(state, actions, comment) {
        api.newComment(comment, state.user.user)
          .then(response => {
            actions.pages.post.form.setField({ key: 'comment', value: ' ' })
            actions.pages.post.receiveComment(response)
          })
      },
    },
    models: {
      form: form({}),
    },
  }
}
