function defaultState() {
  return {
    user: null,
  }
}

export function model() {
  return {
    state: defaultState(),
    reducers: {
      reset() {
        return defaultState()
      },
      receiveUser(state, user) {
        return { user }
      },
    },
  }
}
