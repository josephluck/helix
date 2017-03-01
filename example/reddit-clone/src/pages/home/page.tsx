import { h } from '../../../../../src/html'
import * as moment from 'moment'

import base from '../base'

function post (post) {
  return (
    <div class='bb b--black-10 bg-white pa3 flex items-center'>
      <div class='f4 w2 tc mr3 light-silver bold tracked'>
        {post.votes}
      </div>
      <div>
        <div class='f3 pb2'>{post.title}</div>
        <div class='gray f6'>
          <div class='mb1'>submitted {moment(post.createdOn).fromNow()} by {post.createdBy}</div>
          <div>{post.comments.length} comments</div>
        </div>
      </div>
    </div>
  )
}

function page ({state, prev, actions}) {
  return (
    <div class='pa4'>
      <div class='ba b--black-10 br2 overflow-hidden'>
        {state.pages.home.posts.map(post)}
      </div>
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
