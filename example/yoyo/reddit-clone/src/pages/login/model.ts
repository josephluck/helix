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
          .then(resp => {
            actions.alert.showSuccess(`Hey, ${resp.user.name}!`)
            actions.user.receiveUser(resp.user)
            let redirect = state.location.params.redirect ? state.location.params.redirect : '/'
            actions.location.set(redirect)
          }, err => actions.alert.showError(err))
      },
      logout (state, actions) {
        actions.location.set('/')
        actions.alert.showSuccess(`See you soon, ${state.user.user.name}`)
        actions.user.reset()
      },
    },
    models: {
      form: form(Object.assign({}, currentUser)),
    },
  }
}
