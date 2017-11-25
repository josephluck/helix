import { Helix } from '../../../../src'

export interface Alert {
  showing: boolean
  description: string
  type: 'is-success' | 'is-danger'
}

function emptyAlert(): Alert {
  return {
    showing: false,
    description: '',
    type: 'is-success',
  }
}

export interface State {
  alert: Alert
}

export interface Reducers {
  setAlert: Helix.Reducer<State, Alert>
  removeAlert: Helix.Reducer0<State>
}

export interface Effects {
  showError: Helix.Effect<State, Actions, Error | string>
  showSuccess: Helix.Effect<State, Actions, string>
}

export type Actions = Helix.Actions<Reducers, Effects>

export function model(): Helix.Model<State, Reducers, Effects> {
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
        return { alert: { ...state.alert, showing: false } }
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
