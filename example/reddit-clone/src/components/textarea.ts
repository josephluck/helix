import html from '../../../../src/html'

export default function textField ({
  label,
  type = 'text',
  value,
  onchange,
}) {
  return html`
    <div class='mb3'>
      <label class='db mb2 black-60 f6'>${label}</label>
      <textarea 
        class='db w-100 ph3 pv2 ba b--black-20' 
        rows='15'
        type=${type} 
        value=${value} 
        onchange=${onchange} 
      >${value}</textarea>
    </div>
  `
}
