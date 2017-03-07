import html from '../../../../../src/html'
import textfield from '../../components/textfield'
import textarea from '../../components/textarea'
import form from '../../components/form'

import authenticate from '../authenticate'
import base from '../base'

function page (state, prev, actions) {
  let pageState = state.pages.settings
  let pageActions = actions.pages.settings

  function updateFormField (key) {
    return function (e) {
      pageActions.form.setField(key, e.target.value)
    }
  }

  return html`
    <div>
      <span class='mb4 f4 b dib'>
        Settings
      </span>
      ${form({
        onsubmit () {
          pageActions.submit(pageState.form.title, pageState.form.body)
        },
        submitText: 'Save settings',
        oncancel () {
          actions.location.set('/')
          pageActions.reset()
        },
        child: html`
          <div>
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
    onEnter (state, prev, actions) {
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
