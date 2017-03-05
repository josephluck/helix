import html from '../../../../../src/html'
import * as moment from 'moment'

import base from '../base'

function page ({state, prev, actions}) {
  let post = state.pages.post.post
  if (post) {
    return html`
      <div>
        <div class='times'>
          <h3 class='f2 fw7 ttu tracked lh-title mt0 mb3 avenir'>${post.title}</h3>
          <div class='black-60 f6 mt3'>
            submitted ${moment(post.createdOn).fromNow()} by ${post.createdBy.name}. ${post.comments.length} comments
          </div>
          <div class='mt4 times lh-copy f4 mt0'>
            ${post.body.map(p => html`
              <div class='mb3'>${p}</div>
            `)}
          </div>
        </div>
        <div class='mt5'>
          <span class='f4 b dib mb4'>${post.comments.length} Responses</span>
          ${post.comments.map(comment => html`
            <div class='mb4 pb4 bb b--near-white'>
              <div class='flex items-center mb3'>
                <img
                  class='mr3 br-pill w3 h3 overflow-hidden'
                  src=${comment.createdBy.avatar}
                />
                <div>
                  <div class='mb1'>${comment.createdBy.name}</div>
                  <div class='black-60 f6'>${moment(comment.createdOn).fromNow()}</div>
                </div>
              </div>
              <div class='lh-copy dark-gray'>
                ${comment.body}
              </div>
            </div>
          `)}
        </div>
      </div>
    `
  }
  return ''
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
