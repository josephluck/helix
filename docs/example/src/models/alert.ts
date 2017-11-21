function emptyAlert() {
  return {
    showing: false,
    description: '',
    type: '',
  }
}

export default function alert() {
  return {
    scoped: true,
    state: {
      alert: emptyAlert(),
    },
    reducers: {
      setAlert(state, alert) {
        return { alert }
      },
      removeAlert(state) {
        return { alert: emptyAlert() }
      },
    },
    effects: {
      showError(state, actions, error) {
        actions.setAlert({
          description: error.toString(),
          type: 'is-danger',
          showing: true,
        })
        setTimeout(() => {
          actions.removeAlert()
        }, 5000)
      },
      showSuccess(state, actions, message) {
        actions.setAlert({
          description: message,
          type: 'is-success',
          showing: true,
        })
        setTimeout(() => {
          actions.removeAlert()
        }, 5000)
      },
    },
  }
}
