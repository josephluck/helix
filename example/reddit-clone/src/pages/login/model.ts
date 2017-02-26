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
  }
}
