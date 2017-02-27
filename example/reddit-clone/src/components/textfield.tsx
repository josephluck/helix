import { h } from '../../../../src/html'

export default function TextField ({
  label,
  type = 'text',
  value,
  onInput,
}) {
  return (
    <div class='control'>
      <label class='label'>{label}</label>
      <input class='input' type={type} value={value} onInput={onInput} />
    </div>
  )
}
