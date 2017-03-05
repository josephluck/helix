import html from '../../../../src/html'
import button from './button'

export default function Form ({
  onsubmit,
  oncancel,
  child,
  submitText,
  cancelText = 'cancel',
}) {
  return html`
    <form
      onsubmit=${e => {
        e.preventDefault()
        onsubmit()
      }}
    >
      ${child}
      <div class='inline-flex items-center'>
        ${button({
          label: submitText,
        })}
        <a
          class='ml3 gray fw1'
          onclick=${oncancel}
        >
          ${cancelText}
        </a>
      </div>
    </form>
  `
}
