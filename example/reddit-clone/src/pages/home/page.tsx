import { h } from '../../../../../src/html'
import base from '../base'

function post (post) {
  return (
    <div>
      {post}
    </div>
  )
}

function page ({state, prev, actions}) {
  return (
    <div>
      {state.pages.home.posts.map(post)}
    </div>
  )
}

export default function () {
  return {
    onWillMount (state, prev, actions) {
      actions.pages.home.requestPosts()
    },
    view: base(page),
  }
}
