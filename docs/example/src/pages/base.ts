import * as html from 'yo-yo'
import alert from '../components/alert'
import navigation from '../components/navigation'

export default function (child) {
  return function (state, prev, actions) {
    console.log('state: ', state)
    return html`
      <div class='sans-serif vh-100 vw-100 overflow-auto'>
        <div class='center mw7 ph4 ph5-m ph6-l'>
          ${navigation({
        user: state.user.user,
        onAvatarClick() {
          actions.location.set(`/settings?redirect=${state.location.pathname}`)
        },
      })}
          <div class='mt4'>
            ${child(state, prev, actions)}
          </div>
          ${alert({
        showing: state.alert.alert.showing,
        description: state.alert.alert.description,
        type: state.alert.alert.type,
        onDelete: actions.alert.removeAlert,
      })}
        </div>
      </div>
    `
  }
}
