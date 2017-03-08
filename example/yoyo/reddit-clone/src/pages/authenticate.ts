import html from '../../../../src/html'

export default function (view) {
  return {
    onEnter (state, prev, actions) {
      if (!state.user.user) {
        actions.location.set(`/login?redirect=${state.location.pathname}`)
        actions.alert.showError('You must be logged in')
      }
    },
    view,
  }
}
