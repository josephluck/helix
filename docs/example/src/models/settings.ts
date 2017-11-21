import * as Form from './form'

export function model() {
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
      form: Form.model({
        name: '',
        username: '',
        password: '',
      }),
    },
  }
}
