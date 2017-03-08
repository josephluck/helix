import html from '../../../../../src/html'
import * as moment from 'moment'

import base from '../base'

function post (post) {
  return html`
    <div class='mb4 flex items-center'>
      <div class='f4 w2 tc mr3 light-silver bold tracked'>
        ${post.votes}
      </div>
      <div>
        <a class='fw7 dib mb1 blue no-underline' href=${`/posts/${post.uuid}`}>${post.title}</a>
        <div class='black-60 f6'>
          <div class='mb'>
            submitted ${moment(post.createdOn).fromNow()} by ${post.createdBy.name}. 
            ${post.comments.length ? html`<span>${post.comments.length} comments</span>` : ''}
          </div>
        </div>
      </div>
    </div>
  `
}

function page (state, prev, actions) {
  return html`
    <div>
      ${state.pages.home.posts.length
        ? html`
          <div class=''>
            ${state.pages.home.posts.map(post)}
          </div>
        ` : null
      }
    </div>
  `
}

export default function () {
  return {
    onEnter (state, prev, actions) {
      actions.pages.home.requestPosts()
    },
    onLeave (state, prev, actions) {
      actions.pages.home.resetState()
    },
    view: base(page),
  }
}
