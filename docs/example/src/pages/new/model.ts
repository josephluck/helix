import api from '../../api'
import form from '../../model/form'

export default function model() {
  return {
    state: {},
    reducers: {
      resetState() {
        return {}
      },
    },
    effects: {
      submit(state, actions) {
        const { title, body } = state.pages.newPost.form
        return api.newPost(title, body)
          .then(post => {
            actions.location.set(`/posts/${post.uuid}`)
            actions.alert.showSuccess('Post saved')
          })
          .catch(actions.alert.showError)
      },
    },
    models: {
      form: form({
        title: '',
        body: '',
      }),
    },
  }
}
