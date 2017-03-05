import html from '../../../../src/html'

import alert from '../components/alert'
import navigation from '../components/navigation'

export default function (child) {
  return function ({state, prev, actions}) {
    return html`
      <div class='sans-serif vh-100 vw-100 overflow-auto bg-near-white'>
        ${navigation({
          user: state.user.user,
          onAvatarClick: actions.pages.login.logout,
        })}
        ${child({
          state,
          prev,
          actions,
        })}
        ${alert({
          showing: state.alert.alert.showing,
          description: state.alert.alert.description,
          type: state.alert.alert.type,
          onDelete: actions.alert.removeAlert,
        })}
      </div>
    `
  }
}
