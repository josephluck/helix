import * as React from 'react'
import helix, { Helix } from '../../../src' // 'helix-js'
import renderer from '../../../src/renderers/react' // 'helix-js/renderers/react'

interface State {
  count: number
}

interface Reducers {
  increment: Helix.Reducer0<State>
  decrement: Helix.Reducer0<State>
}

interface Effects {}

type Actions = Helix.Actions<Reducers, Effects>

const model: Helix.Model<State, Reducers, Effects> = {
  state: {
    count: 0,
  },
  reducers: {
    increment(state) {
      return { count: state.count + 1 }
    },
    decrement(state) {
      return { count: state.count - 1 }
    },
  },
  effects: {},
}

const component: Helix.Component<State, Actions> = (state, previous, actions) => {
  return (
    <div>
      <h1>Counter</h1>
      <button onClick={actions.decrement}>Decrement</button>
      <span>{state.count}</span>
      <button onClick={actions.increment}>Increment</button>
    </div>
  )
}

const mount = document.createElement('div')
document.body.appendChild(mount)

helix<State, Actions>({
  model,
  component,
  render: renderer(mount),
})
