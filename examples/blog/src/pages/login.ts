import { Helix } from '../../../../src'
import * as html from 'yo-yo'
import base from './base'
import textfield from '../components/textfield'
import form from '../components/form'
import updater from '../utils/update-form-field'
import { GlobalState, GlobalActions } from '../models'

const page: Helix.Component<GlobalState, GlobalActions> = (state, prev, actions) => {
  let pageState = state.login
  let pageActions = actions.login
  const updateFormField = updater(pageActions.form.setField)

  return html`
    <div>
      ${form({
        onsubmit: pageActions.submit,
        submitText: 'Login',
        oncancel() {
          pageActions.resetState()
          actions.location.set('/')
        },
        child: html`
          <div>
            ${textfield({
              label: 'Username',
              value: pageState.form.username,
              oninput: updateFormField('username'),
            })}
            ${textfield({
              label: 'Password',
              value: pageState.form.password,
              type: 'password',
              oninput: updateFormField('password'),
            })}
          </div>
        `,
      })}
    </div>
  `
}

export default function(): Helix.Page<GlobalState, GlobalActions> {
  return {
    view: base(page),
  }
}
