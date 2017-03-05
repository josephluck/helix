import html from '../../../../../src/html'
import textfield from '../../components/textfield'
import form from '../../components/form'

export default function login ({state, prev, actions}) {
  let pageState = state.pages.login
  let pageActions = actions.pages.login

  function updateFormField (key) {
    return function (e) {
      pageActions.setFormField(key, e.target.value)
    }
  }

  return html`
    <div class='pa4'>
      ${form({
        onsubmit () {
          pageActions.submit(pageState.username, pageState.password)
        },
        submitText: 'Login',
        oncancel: pageActions.reset,
        child: html`
          <div>
            ${textfield({
              label: 'Username',
              value: pageState.username,
              oninput: updateFormField('username'),
            })}
            ${textfield({
              label: 'Password',
              value: pageState.password,
              type: 'password',
              oninput: updateFormField('password'),
            })}
          </div>
        `,
      })}
    </div>
  `
}
