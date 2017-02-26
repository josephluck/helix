export default function user () {
  return {
    scoped: true,
    state: {
      user: null,
    },
    reducers: {
      receiveUser (state, user) {
        return {
          ...state,
          user,
        }
      },
    },
  }
}
