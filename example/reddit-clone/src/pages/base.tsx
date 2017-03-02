import { h } from '../../../../src/html'

function Alert ({
  showing,
  description,
  type,
  onDelete,
}) {
  let className = `pa3 br2 bg-light-gray ba b--black-10`
  let style = `
    display: inline-block;
    max-width: 400px; transition: all 0.4s ease-in-out;
    transform: translateY(${showing ? '0%' : '200%'});
    opacity: ${showing ? '1' : '0'}
  `
  return (
    <div style='text-align: center; position: fixed; bottom: 20px; left: 0px; right: 0px;'>
      <div
        class={className}
        style={style}
      >
        {description}
      </div>
    </div>
  )
}

export default function (Child) {
  return function ({state, prev, actions}) {
    return (
      <div class='sans-serif vh-100 vw-100 overflow-auto bg-near-white'>
        <Child state={state} prev={prev} actions={actions} onComponentWillMount={() => null} />
        <Alert
          showing={state.alert.alert.showing}
          description={state.alert.alert.description}
          type={state.alert.alert.type}
          onDelete={actions.alert.removeAlert}
        />
      </div>
    )
  }
}
