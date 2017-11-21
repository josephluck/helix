import * as html from 'yo-yo'
import textfield from '../components/textfield'
import form from '../components/form'
import base from './base'
import updater from '../utils/update-form-field'

function page(state, prev, actions) {
  let pageState = state.settings
  let pageActions = actions.settings
  const updateFormField = updater(pageActions.form.setField)
  return html`
    <div>
      <span class='mb4 f4 b dib'>
        Your details
      </span>
      ${form({
      onsubmit() {
        actions.location.set(state.location.query.redirect || '/')
        console.log('update user')
      },
      submitText: 'Save',
      oncancel() {
        actions.location.set(state.location.query.redirect || '/')
        pageActions.resetState()
      },
      child: html`
          <div>
            ${textfield({
          label: 'Name',
          value: pageState.form.name,
          oninput: updateFormField('name'),
        })}
            ${textfield({
          label: 'Email address',
          value: pageState.form.username,
          oninput: updateFormField('username'),
        })}
            ${textfield({
          label: 'Password',
          type: 'password',
          value: pageState.form.password,
          oninput: updateFormField('password'),
        })}
          </div>
        `,
    })}
    </div>
  `
}

export default function () {
  return {
    onEnter(state, prev, actions) {
      if (!state.user.user) {
        actions.location.set(`/login?redirect=${state.location.pathname}`)
        actions.alert.showError('You must be logged in')
      } else {
        actions.settings.init(state.user.user)
      }
    },
    view: base(page),
  }
}
