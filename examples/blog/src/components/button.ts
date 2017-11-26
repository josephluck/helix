import * as html from 'yo-yo'

export interface Props {
  type?: string
  label: string
  onclick?: () => any
}

export default function button({ type = 'submit', label = 'Submit', onclick = () => null }: Props) {
  return html`
    <button
      class='dib button-reset bg-white ba b--black-20 br1 pa2 black-60 f6'
      type=${type}
      onclick=${onclick}
    >
      ${label}
    </button>
  `
}
