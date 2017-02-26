function emptyAlert () {
  return {
    description: '',
    type: '',
  }
}

export default function alert () {
  return {
    scoped: true,
    state: {
      alert: emptyAlert(),
    },
    reducers: {
      setAlert (state, alert) {
        return {
          alert,
        }
      },
      removeAlert (state) {
        return {
          alert: emptyAlert(),
        }
      }
    },
    effects: {
      showError (state, methods, error) {
        methods.setAlert({
          description: error.toString(),
          type: 'is-danger',
        })
        setTimeout(() => {
          methods.removeAlert()
        }, 5000)
      },
    },
  }
}
