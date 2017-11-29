import { Helix } from '../../../../src'
import * as html from 'yo-yo'
import * as moment from 'moment'
import base from './base'
import form from '../components/form'
import textarea from '../components/textarea'
import updater from '../utils/update-form-field'
import { GlobalState, GlobalActions } from '../models'
import { Comment } from '../api/fixtures/comment'

interface TitleProps {
  title: string
  createdOn: string
  createdBy: string
  numberOfComments: number
}

const title = ({ title, createdOn, createdBy, numberOfComments }: TitleProps) => html`
  <div>
    <h3 class='f2 fw7 ttu tracked lh-title mt0 mb3 avenir'>${title}</h3>
    <div class='black-60 f6 mt4'>
      submitted
      ${moment(createdOn).fromNow()}
      by ${createdBy}.
      ${numberOfComments} comments
    </div>
  </div>
`

const paragraph = (text: string) => html`<div class='mb3'>${text}</div>`

interface CommentFormProps {
  onSubmit: () => any
  commentValue: string
  updateCommentValue: (comment: string) => any
}

const commentForm = ({ onSubmit, commentValue, updateCommentValue }: CommentFormProps) => html`
  <div class='mt5'>
    <span class='f4 b dib mb3'>Have your say</span>
    ${form({
      onsubmit: onSubmit,
      submitText: 'Save comment',
      child: textarea({
        value: commentValue,
        oninput: updateCommentValue,
      }),
    })}
  </div>
`

const comment = (comment: Comment) => html`
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
`

interface LoginPromptProps {
  onClick: () => any
}

const loginPrompt = ({ onClick }: LoginPromptProps) => html`
  <span class='ml2 i black-60 f6'>
    You must be 
    <a 
      onclick=${onClick} 
      class='pointer blue no-underline'
    >
      logged in
    </a>
    to respond
  </span>
`

const page: Helix.Component<GlobalState, GlobalActions> = (state, prev, actions) => {
  const updateFormField = updater(actions.post.form.setField)
  let post = state.post.post
  if (post) {
    return html`
      <div>
        <div>
          ${title({
            title: post.title,
            createdOn: post.createdOn,
            createdBy: post.createdBy.name,
            numberOfComments: post.comments.length,
          })}
          <div class='mt4 lh-copy f4 mt0'>
            ${post.body.map(paragraph)}
          </div>
        </div>
        ${
          state.user.user
            ? commentForm({
                onSubmit: () => actions.post.submitComment(state.post.form.comment),
                commentValue: state.post.form.comment,
                updateCommentValue: updateFormField('comment'),
              })
            : ''
        }
        ${
          post.comments.length
            ? html`
              <div class='mt5'>
                <div class='mb4'>
                  <span class='f4 b dib'>
                    ${post.comments.length} Response${post.comments.length > 1 ? 's' : ''}
                  </span>
                  ${
                    !state.user.user
                      ? loginPrompt({
                          onClick: () =>
                            actions.location.set(`/login?redirect=/posts/${post.uuid}`),
                        })
                      : ''
                  }
                </div>
                ${post.comments.map(comment)}
              </div>
            `
            : ''
        }
      </div>
    `
  }
  return ''
}

export default function(): Helix.Page<GlobalState, GlobalActions> {
  return {
    onEnter(state, prev, actions) {
      actions.post.requestPost()
    },
    onLeave(state, prev, actions) {
      actions.post.resetState()
    },
    view: base(page),
  }
}
