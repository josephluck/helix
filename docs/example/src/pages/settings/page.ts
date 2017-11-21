import * as html from 'yo-yo'
import textfield from '../../components/textfield'
import form from '../../components/form'
import base from '../base'

function page(state, prev, actions) {
  let pageState = state.pages.settings
  let pageActions = actions.pages.settings

  function updateFormField(key) {
    return function (e) {
      pageActions.form.setField({ key, value: e.target.value })
    }
  }

  return html`
    <div>
      <span class='mb4 f4 b dib'>
        Your details
      </span>
      ${form({
        onsubmit() {
          console.log('update user')
        },
        submitText: 'Save',
        oncancel() {
          actions.location.set('/')
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
        actions.pages.settings.init(state.user.user)
      }
    },
    view: base(page),
  }
}
