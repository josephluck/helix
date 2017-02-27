export default function user () {
  return {
    state: {
      user: null,
    },
    reducers: {
      receiveUser (state, user) {
        return {
          user,
        }
      },
    },
  }
}
