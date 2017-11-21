import form from './form'

export default function model() {
  return {
    state: {},
    reducers: {
      resetState() {
        return {}
      },
    },
    effects: {
      init(state, actions, user) {
        return actions.settings.form.setForm(user)
      },
    },
    models: {
      form: form({
        name: '',
        username: '',
        password: '',
      }),
    },
  }
}
