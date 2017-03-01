import home from '../pages/home/page'
import login from '../pages/login/page'
import base from '../pages/base'

export default function routes () {
  return {
    '': {
      onWillMount (state, prev, actions) {
        console.log('home onWillMount', `curr: ${state.location.pathname}`, `prev: ${prev.location.pathname}`)
      },
      onWillUnmount (elm, state, prev, actions) {
        console.log('home onWillUnmount', `curr: ${state.location.pathname}`, `prev: ${prev.location.pathname}`)
      },
      view: base(home),
    },
    'login': {
      onWillMount (state, prev, actions) {
        console.log('login onWillMount', `curr: ${state.location.pathname}`, `prev: ${prev.location.pathname}`)
      },
      onWillUnmount (elm, state, prev, actions) {
        console.log('login onWillUnmount', `curr: ${state.location.pathname}`, `prev: ${prev.location.pathname}`)
      },
      view: base(login),
    },
  }
}
