import api from '../../api'
import form from '../../model/form'
import user from '../../api/fixtures/user'

let currentUser = user()

export default function model () {
  return {
    state: {},
    reducers: {
      reset () {
        return {}
      },
    },
    effects: {
      submit (state, actions, username, password) {
        return api.login(currentUser, username, password)
          .then(authResponse => {
            actions.location.set('/')
            actions.alert.showSuccess('Successfully logged in')
            actions.user.receiveUser(authResponse.user)
          }, err => actions.alert.showError(err))
      },
      logout (state, actions) {
        actions.location.set('/')
        actions.alert.showSuccess('Successfully logged out')
        actions.user.reset()
      },
    },
    models: {
      form: form(Object.assign({}, currentUser)),
    },
  }
}
