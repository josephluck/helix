import { h } from '../../../../src/html'
import button from './button'

export default function Form ({
  onSubmit,
  onCancel,
  children,
  submitText,
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
      <div class='inline-flex items-center'>
        {button({
          label: submitText,
        })}
        <a
          class='silver'
          onclick={onCancel}
        >
          {cancelText}
        </a>
      </div>
    </form>
  )
}