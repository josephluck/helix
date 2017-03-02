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
        <a class='f3 dib mb1 blue no-underline' href={`/posts/${post.uuid}`}>{post.title}</a>
        <div class='gray f6'>
          <div class='mb'>
            submitted {moment(post.createdOn).fromNow()} by {post.createdBy}
          </div>
          <div>{post.comments.length} comments</div>
        </div>
      </div>
    </div>
  )
}

function page ({state, prev, actions}) {
  return (
    <div class='pa4'>
      {state.pages.home.posts.length
        ? (
          <div class='ba b--black-10 br2 overflow-hidden'>
            {state.pages.home.posts.map(post)}
          </div>
        ) : null
      }
    </div>
  )
}

export default function () {
  return {
    onMount (state, prev, actions) {
      actions.pages.home.requestPosts()
    },
    onUnmount (state, prev, actions) {
      actions.pages.home.resetState()
    },
    view: base(page),
  }
}
