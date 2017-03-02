import { h } from '../../../../src/html'

export default function TextField ({
  label,
  type = 'text',
  value,
  onInput,
}) {
  return (
    <div class='mb3'>
      <label class='db mb2 gray f6'>{label}</label>
      <input class='db w-100 ph3 pv2 ba b--black-20 br2' type={type} value={value} onInput={onInput} />
    </div>
  )
}
