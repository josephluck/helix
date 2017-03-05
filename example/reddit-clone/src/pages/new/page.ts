import html from '../../../../../src/html'
import textfield from '../../components/textfield'
import textarea from '../../components/textarea'
import form from '../../components/form'

export default function newPost ({state, prev, actions}) {
  let pageState = state.pages.newPost
  let pageActions = actions.pages.newPost

  function updateFormField (key) {
    return function (e) {
      pageActions.form.setField(key, e.target.value)
    }
  }

  return html`
    <div>
      ${form({
        onsubmit () {
          pageActions.submit(pageState.form.title, pageState.form.body)
        },
        submitText: 'Save post',
        oncancel () {
          actions.location.set('/')
          pageActions.reset()
        },
        child: html`
          <div>
            ${textfield({
              label: 'Title',
              value: pageState.form.title,
              oninput: updateFormField('title'),
            })}
            ${textarea({
              label: 'Body',
              value: pageState.form.body,
              type: 'body',
              onchange: updateFormField('body'),
            })}
          </div>
        `,
      })}
    </div>
  `
}
