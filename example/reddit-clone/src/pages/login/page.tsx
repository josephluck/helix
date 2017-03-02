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

  return (
    <div class='pa4'>
      <Form
        onSubmit={() => pageActions.submit(pageState.username, pageState.password)}
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
