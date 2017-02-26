import { h } from '../../../../../src/html'
import TextField from '../../components/textfield'
import Form from '../../components/form'

export default function login ({state, prev, actions}) {
  let pageState = state.pages.login
  let pageActions = actions.pages.login

  function updateFormField (key) {
    return function (e) {
      pageActions.setFormField(key, e.target.value)
    }
  }

  function submit () {
    pageActions.submit()
      .then(function (authResponse) {
        actions.alert.showSuccess('Successfully logged in')
        actions.user.receiveUser(authResponse.user)
        actions.location.set('/')
      }, function (err) {
        actions.alert.showError(err)
      })
  }

  return (
    <div class='section'>
      <Form
        onSubmit={submit}
        onCancel={pageActions.reset}
      >
        <TextField
          label='Username'
          value={pageState.username}
          onInput={updateFormField('username')}
        />
        <TextField
          label='Password'
          type='password'
          value={pageState.password}
          onInput={updateFormField('password')}
        />
      </Form>
    </div>
  )
}
