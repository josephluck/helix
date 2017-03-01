import { h } from '../../../../../src/html'
import base from '../base'

function post (post) {
  return (
    <div class='panel'>
      <div class='panel-block'>
        <div>
          <h1 class='title is-4'>{post.title}</h1>
          <h1>submitted {post.createdOn} by {post.createdBy}</h1>
          <div>{post.comments.length} comments</div>
        </div>
      </div>
    </div>
  )
}

function page ({state, prev, actions}) {
  return (
    <div class='section'>
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
