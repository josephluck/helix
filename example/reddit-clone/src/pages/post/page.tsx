import { h } from '../../../../../src/html'
import * as moment from 'moment'

import base from '../base'
import renderPost from '../../components/post'

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
    onMount (state, prev, actions) {
      actions.pages.post.requestPost()
    },
    onUnmount (state, prev, actions) {
      actions.pages.post.resetState()
    },
    view: base(page),
  }
}
