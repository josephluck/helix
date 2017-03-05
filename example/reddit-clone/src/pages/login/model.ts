import api from '../../api'
import { fixture as user } from '../../api/fixtures/user'

function defaultState () {
  return user
}

export default function model () {
  return {
    state: defaultState(),
    reducers: {
      reset () {
        return defaultState()
      },
      setFormField (state, key, value) {
        return {
          [key]: value,
        }
      },
    },
    effects: {
      submit (state, actions, username, password) {
        return api.login(username, password)
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
      }
    },
  }
}
