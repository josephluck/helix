import * as html from 'yo-yo'

export interface Props {
  label?: string
  type?: string
  value: string
  oninput: (event) => any
}

export default function textField({ label, type = 'text', value, oninput }: Props) {
  return html`
    <div class='mb3'>
      ${label ? html`<label class='db mb2 black-60 f6'>${label}</label>` : ''}
      <textarea 
        class='db w-100 pa2 ba b--black-20 br1' 
        rows='15'
        type=${type} 
        value=${value} 
        oninput=${oninput} 
      >${value}</textarea>
    </div>
  `
}
