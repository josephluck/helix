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
        class='db w-100 ph3 pv2 ba b--black-20' 
        type=${type} 
        value=${value} 
        oninput=${oninput} 
      />
    </div>
  `
}
