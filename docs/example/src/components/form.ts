import * as html from 'yo-yo'
import button from './button'

export interface Props {
  onsubmit: () => any
  oncancel?: () => any
  child: HTMLElement
  submitText: string
  cancelText?: string
}

export default function Form({
  onsubmit,
  oncancel,
  child,
  submitText,
  cancelText = 'cancel',
}: Props) {
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
        ${
          oncancel
            ? html`
            <a
              class='ml3 black-60 f6'
              onclick=${oncancel}
            >
              ${cancelText}
            </a>
          `
            : ''
        }
      </div>
    </form>
  `
}
