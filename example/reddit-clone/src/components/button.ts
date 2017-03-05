import html from '../../../../src/html'

export default function button ({
  type = 'submit',
  label = 'Submit',
  onclick = () => null,
}) {
  return html`
    <button
      class='dib button-reset bg-white ba b--black-20 ph3 pv2 black-60 f6'
      type=${type}
      onclick=${onclick}
    >
      ${label}
    </button>
  `
}
