import home from '../pages/home/page'
import login from '../pages/login/page'
import base from '../pages/base'

export default function routes () {
  return {
    '': {
      onWillMount (state, prev, actions) {
        console.log('home onWillMount', state, prev, actions)
      },
      onWillUnmount (elm, state, prev, actions) {
        console.log('home onWillUnmount', elm, state, prev, actions)
      },
      view: base(home),
    },
    'login': {
      onWillMount (state, prev, actions) {
        console.log('login onWillMount', state, prev, actions)
      },
      onWillUnmount (elm, state, prev, actions) {
        console.log('login onWillUnmount', elm, state, prev, actions)
      },
      view: base(login),
    },
  }
}
