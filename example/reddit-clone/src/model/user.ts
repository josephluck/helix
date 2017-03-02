function defaultState () {
  return {
    user: null,
  }
}

export default function user () {
  return {
    state: defaultState(),
    reducers: {
      reset () {
        return defaultState()
      },
      receiveUser (state, user) {
        return {
          user,
        }
      },
    },
  }
}
