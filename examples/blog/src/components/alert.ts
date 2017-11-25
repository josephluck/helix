import * as html from 'yo-yo'

export interface Props {
  showing: boolean
  description: string
  type: string
  onDelete: () => any
}

export default function alert({ showing, description, type, onDelete }: Props) {
  let className = `pa3 bg-white br1 ba b--black-20`
  let style = `
    display: inline-block;
    max-width: 400px; transition: all 0.4s ease-in-out;
    transform: translateY(${showing ? '0%' : '200%'});
    opacity: ${showing ? '1' : '0'}
  `
  return html`
    <div style='text-align: center; position: fixed; bottom: 20px; left: 0px; right: 0px;'>
      <div
        class=${className}
        style=${style}
      >
        ${description}
      </div>
    </div>
  `
}
