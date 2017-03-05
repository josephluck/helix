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
          class='ml3 black-60 f6'
          onclick=${oncancel}
        >
          ${cancelText}
        </a>
      </div>
    </form>
  `
}
