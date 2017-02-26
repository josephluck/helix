import { h } from '../../../../../src/html'

export default function login ({state, prev, actions}) {
  console.log(state.pages.login)
  function updateFormField (key) {
    return function (e) {
      actions.pages.login.setFormField(key, e.target.value)
    }
  }
  return (
    <div>
      <form>
        <div class='control'>
          <label class='label'>Username</label>
          <input class='input' type='text' value={state.pages.login.username} oninput={updateFormField('username')} />
        </div>
        <div class='control'>
          <label class='label'>Password</label>
          <input class='input' type='password' value={state.pages.login.password} oninput={updateFormField('password')} />
        </div>
      </form>
    </div>
  )
}