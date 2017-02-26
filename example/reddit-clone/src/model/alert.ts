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
      alert: {
        showing: false,
        description: '',
        type: '',
      },
    },
    reducers: {
      setAlert (state, alert) {
        return {
          alert,
        }
      },
      removeAlert (state) {
        return {
          alert: {
            ...state.alert,
            showing: false,
          },
        }
      }
    },
    effects: {
      showError (state, methods, error) {
        methods.setAlert({
          description: error.toString(),
          type: 'is-danger',
          showing: true,
        })
        setTimeout(() => {
          methods.removeAlert()
        }, 5000)
      },
      showSuccess (state, methods, message) {
        methods.setAlert({
          description: message,
          type: 'is-success',
          showing: true,
        })
        setTimeout(() => {
          methods.removeAlert()
        }, 5000)
      }
    },
  }
}
