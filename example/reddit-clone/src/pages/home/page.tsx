import { h } from '../../../../../src/html'

export default function home ({state, prev, actions}) {
  let pageState = state.pages.home
  let pageActions = actions.pages.home

  return (
    <div class='section'>
      Home page
    </div>
  )
}
