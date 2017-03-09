import html from '../../../../../src/html'
import * as moment from 'moment'

import base from '../base'
import form from '../../components/form'
import textarea from '../../components/textarea'

function page (state, prev, actions) {
  const updateFormField = (key) => (e) => actions.pages.post.form.setField(key, e.target.value)
  let post = state.pages.post.post
  if (post) {
    return html`
      <div>
        <div>
          <h3 class='f2 fw7 ttu tracked lh-title mt0 mb3 avenir'>${post.title}</h3>
          <div class='black-60 f6 mt4'>
            submitted ${moment(post.createdOn).fromNow()} by ${post.createdBy.name}. ${post.comments.length} comments
          </div>
          <div class='mt4 lh-copy f4 mt0'>
            ${post.body.map(p => html`
              <div class='mb3'>${p}</div>
            `)}
          </div>
        </div>
        ${state.user.user
          ? html`
            <div class='mt5'>
              <span class='f4 b dib mb3'>Add your response</span>
              ${form({
                onsubmit () {
                  actions.pages.post.submitComment(state.pages.post.form.comment)
                },
                submitText: 'Save comment',
                child: html`
                  <div>
                    ${textarea({
                      value: state.pages.post.form.comment,
                      oninput: updateFormField('comment'),
                    })}
                  </div>
                `,
              })}
            </div>
          `
          : ''
        }
        ${post.comments.length
          ? html`
            <div class='mt5'>
              <div class='mb4'>
                <span class='f4 b dib'>
                  ${post.comments.length} Response${post.comments.length > 1 ? 's' : ''}
                </span>
                ${!state.user.user
                  ? html`
                    <span class='ml2 i black-60 f6'>
                      You must be 
                      <a 
                        onclick=${() => actions.location.set(`/login?redirect=/posts/${post.uuid}`)} 
                        class='pointer blue no-underline'
                      >
                        logged in
                      </a>
                      to respond
                    </span>
                  ` : ''
                }
              </div>
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
          ` : ''
        }
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
