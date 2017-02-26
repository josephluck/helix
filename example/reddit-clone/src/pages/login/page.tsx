import { h } from '../../../../../src/html'
import TextField from '../../components/textfield'

function Form ({
  onSubmit,
  onCancel,
  children,
  submitText = 'submit',
  cancelText = 'cancel',
}) {
  return (
    <form 
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {children}
      <div class='control is-grouped'>
        <p class='control'>
          <button
            class='button is-primary'
            type='submit'
          >
            Submit
          </button>
        </p>
        <p class='control'>
          <a
            class='button is-light'
            onclick={onCancel}
          >
            Cancel
          </a>
        </p>
      </div>
    </form>
  )
}

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
      .then(function () {
        actions.alert.showSuccess('Successfully logged in')
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
