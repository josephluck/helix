import html from '../../../../../src/html'
import * as moment from 'moment'

import base from '../base'
import renderPost from '../../components/post'

function page ({state, prev, actions}) {
  let post = state.pages.post.post
  return html`
    <div class='pa4'>
      ${post
        ? html`
          <div class='ba b--black-10 br2 overflow-hidden'>
            ${renderPost(post)}
          </div>
        ` : ''
      }
    </div>
  `
}

export default function () {
  return {
    onEnter (state, prev, actions) {
      actions.pages.post.requestPost()
    },
    onLeave (state, prev, actions) {
      actions.pages.post.resetState()
    },
    view: base(page),
  }
}
