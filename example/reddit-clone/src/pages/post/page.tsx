import { h } from '../../../../../src/html'
import * as moment from 'moment'

import base from '../base'

function renderPost (post) {
  return (
    <div class='bb b--black-10 bg-white pa3 flex items-center'>
      <div class='f4 w2 tc mr3 light-silver bold tracked'>
        {post.votes}
      </div>
      <div>
        <a class='f3 pb2 blue no-underline' href={`/posts/${post.uuid}`}>{post.title}</a>
        <div class='gray f6'>
          <div class='mb1'>
            submitted {moment(post.createdOn).fromNow()} by {post.createdBy}
          </div>
          <div>{post.comments.length} comments</div>
        </div>
      </div>
    </div>
  )
}

function page ({state, prev, actions}) {
  let post = state.pages.post.post
  return (
    <div class='pa4'>
      {post
        ? (
          <div class='ba b--black-10 br2 overflow-hidden'>
            {renderPost(post)}
          </div>
        ) : null
      }
    </div>
  )
}

export default function () {
  return {
    onWillMount (state, prev, actions) {
      actions.pages.post.requestPost()
    },
    onWillUnmount (state, prev, actions) {
      actions.pages.post.resetState()
    },
    view: base(page),
  }
}
