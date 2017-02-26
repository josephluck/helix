import { h } from '../../../../../src/html'
import TextField from '../../components/textfield'

export default function login ({state, prev, actions}) {
  let pageState = state.pages.login
  let pageActions = actions.pages.login
  console.log(pageState)

  function updateFormField (key) {
    return function (e) {
      pageActions.setFormField(key, e.target.value)
    }
  }

  return (
    <div class='section'>
      <form>
        <TextField label='Username' value={pageState.username} onInput={updateFormField('username')} />
        <TextField label='Password' value={pageState.password} onInput={updateFormField('password')} />
      </form>
    </div>
  )
}