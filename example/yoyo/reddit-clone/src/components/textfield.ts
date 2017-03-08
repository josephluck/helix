import html from '../../../../src/html'

export default function textField ({
  label,
  type = 'text',
  value,
  oninput,
}) {
  return html`
    <div class='mb3'>
      <label class='db mb2 black-60 f6'>${label}</label>
      <input 
        class='db w-100 pa2 ba b--black-20 br1' 
        type=${type} 
        value=${value} 
        oninput=${oninput} 
      />
    </div>
  `
}
