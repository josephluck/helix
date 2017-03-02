import home from '../pages/home/page'
import post from '../pages/post/page'
import login from '../pages/login/page'
import base from '../pages/base'

export default function routes () {
  return {
    '': home(),
    'posts/:postId': post(),
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
