import { h } from '../../../../src/html'

export default function Form ({
  onSubmit,
  onCancel,
  children,
  submitText = 'submit',
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
      <div class='control is-grouped'>
        <p class='control'>
          <button
            class='button is-primary'
            type='submit'
          >
            {submitText}
          </button>
        </p>
        <p class='control'>
          <a
            class='button is-light'
            onclick={onCancel}
          >
            {cancelText}
          </a>
        </p>
      </div>
    </form>
  )
}