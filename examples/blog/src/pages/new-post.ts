import { Helix } from '../../../../src'
import * as html from 'yo-yo'
import base from './base'
import textfield from '../components/textfield'
import textarea from '../components/textarea'
import form from '../components/form'
import updater from '../utils/update-form-field'
import { GlobalState, GlobalActions } from '../models'

const page: Helix.Component<GlobalState, GlobalActions> = (state, prev, actions) => {
  let pageState = state.newPost
  let pageActions = actions.newPost
  const updateFormField = updater(pageActions.form.setField)

  return html`
    <div>
      ${form({
        onsubmit: pageActions.submit,
        submitText: 'Save post',
        oncancel() {
          actions.location.set('/')
          pageActions.resetState()
        },
        child: html`
          <div>
            ${textfield({
              label: 'Title',
              value: pageState.form.title,
              oninput: updateFormField('title'),
            })}
            ${textarea({
              label: 'Body',
              value: pageState.form.body,
              oninput: updateFormField('body'),
            })}
          </div>
        `,
      })}
    </div>
  `
}

export default function(): Helix.Page<GlobalState, GlobalActions> {
  return {
    onEnter(state, prev, actions) {
      if (!state.user.user) {
        actions.location.set(`/login?redirect=${state.location.pathname}`)
        actions.alert.showError('You must be logged in')
      }
    },
    view: base(page),
  }
}
