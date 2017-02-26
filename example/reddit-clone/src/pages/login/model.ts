import api from '../../api'

function defaultState () {
  return {
    username: 'joseph@example.com',
    password: 'password',
  }
}

export default function model () {
  return {
    scoped: true,
    state: defaultState(),
    reducers: {
      reset (_state) {
        return defaultState()
      },
      setFormField (state, key, value) {
        return {
          ...state,
          [key]: value,
        }
      },
    },
    effects: {
      submit (state, actions, onError) {
        return api.login(state.username, state.password)
          .then(() => {
            console.log('Successfully logged in')
          })
          .catch(onError)
      },
    },
  }
}
