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
      <div class='inline-flex items-center'>
        <button
          class='dib button-reset bg-white mid-gray ba b--black-20 br2 ph3 pv2 mr2'
          type='submit'
        >
          {submitText}
        </button>
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