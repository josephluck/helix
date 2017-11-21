import api from '../api'
import form from './form'
import user from '../api/fixtures/user'

let currentUser = user() // mock out authenticated user

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
        let { username, password } = state.login.form
        return api.login(currentUser, username, password)
          .then(resp => {
            actions.alert.showSuccess(`Hey, ${resp.user.name}!`)
            actions.user.receiveUser(resp.user)
            actions.location.set(state.location.query.redirect || '/')
          }, err => actions.alert.showError(err))
      },
      logout(state, actions) {
        actions.location.set('/')
        actions.alert.showSuccess(`See you soon, ${state.user.user.name}`)
        actions.user.resetState()
      },
    },
    models: {
      form: form(Object.assign({}, currentUser, {})),
    },
  }
}
