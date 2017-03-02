import { h } from '../../../../src/html'

export default function button ({
  type = 'submit',
  label = 'Submit',
  onclick = () => null,
}) {
  return (
    <button
      class='dib button-reset bg-white mid-gray ba b--black-20 br2 ph3 pv2 mr2'
      type={type}
      onclick={onclick}
    >
      {label}
    </button>
  )
}