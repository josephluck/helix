require('es6-shim')
import helix from '../../../src'
import { h } from '../../../src/html'

function Links ({
  onRouteClick,
}) {
  return (
    <div>
      <a style='margin-right: 10px;' href='/'>view one</a>
      <a style='margin-right: 10px;' href='/bar'>view two</a>
      <a style='margin-right: 10px;' href='/bar/123'>view three (123)</a>
      <a style='margin-right: 10px;' onClick={() => onRouteClick('/bar/abc')}>view three (abc)</a>
    </div>
  )
}

function viewOne ({state, prev, actions}) {
  return (
    <div>
      <Links onRouteClick={path => actions.location.set(path)} />
      <h1>view one</h1>
      {state.title}
      <div>
        <input value={state.title} onInput={(e: any) => actions.set(e.target.value)} />
      </div>
    </div>
  )
}
function viewTwo ({state, prev, actions}) {
  return (
    <div>
      <Links onRouteClick={path => actions.location.set(path)} />
      <h1>view two</h1>
      {state.title}
      <div>
        <input value={state.title} onInput={(e: any) => actions.set(e.target.value)} />
      </div>
    </div>
  )
}
function viewThree ({state, prev, actions}) {
  return (
    <div>
      <Links onRouteClick={path => actions.location.set(path)} />
      <h1>view three {state.location.params.baz}</h1>
      {state.title}
      <div>
        <input value={state.title} onInput={(e: any) => actions.set(e.target.value)} />
      </div>
    </div>
  )
}

const app = helix({
  model: {
    state: {
      title: 'not set',
    },
    reducers: {
      set (state, title) {
        return Object.assign({}, state, {
          title: title,
        })
      },
    },
    models: {
      counter: {
        scoped: true,
        state: {
          count: 1,
        },
        reducers: {
          increment (state, amount) {
            return {
              count: state.count + (amount || 1),
            }
          },
        },
        effects: {
          incrementAsync (state, actions) {
            setTimeout(() => {
              actions.increment(5)
            }, 1000)
          },
        },
        models: {
          secondTitle: {
            scoped: true,
            state: {
              title: 'hey',
            },
            reducers: {
              update (state, title) {
                return {
                  title: title,
                }
              },
            },
          },
        },
      },
      foo: {
        state: {
          bar: 'baz',
        },
      },
    },
  },
  routes: {
    '': {
      onWillMount (state, prev, actions) {
        // console.log('one onWillMount', state, prev, actions)
      },
      onDidMount (elm, state, prev, actions) {
        // console.log('one onDidMount', elm, state, prev, actions)
      },
      onShouldUpdate (state, prev, actions) {
        // console.log('one onShouldUpdate', state, prev, actions)
      },
      onWillUpdate (state, prev, actions) {
        // console.log('one onWillUpdate', state, prev, actions)
      },
      onDidUpdate (state, prev, actions) {
        // console.log('one onDidUpdate', state, prev, actions)
      },
      onWillUnmount (elm, state, prev, actions) {
        // console.log('one onWillUnmount', elm, state, prev, actions)
      },
      view: viewOne,
    },
    'bar': {
      onWillMount (state, prev, actions) {
        // console.log('two onWillMount', state, prev, actions)
      },
      onDidMount (elm, state, prev, actions) {
        // console.log('two onDidMount', elm, state, prev, actions)
      },
      onShouldUpdate (state, prev, actions) {
        // console.log('two onShouldUpdate', state, prev, actions)
      },
      onWillUpdate (state, prev, actions) {
        // console.log('two onWillUpdate', state, prev, actions)
      },
      onDidUpdate (state, prev, actions) {
        // console.log('two onDidUpdate', state, prev, actions)
      },
      onWillUnmount (elm, state, prev, actions) {
        // console.log('two onWillUnmount', elm, state, prev, actions)
      },
      view: viewTwo,
    },
    'bar/:baz': {
      onWillMount (state, prev, actions) {
        // console.log('three onWillMount', state, prev, actions)
      },
      onDidMount (elm, state, prev, actions) {
        // console.log('three onDidMount', elm, state, prev, actions)
      },
      onShouldUpdate (state, prev, actions) {
        // console.log('three onShouldUpdate', state, prev, actions)
      },
      onWillUpdate (state, prev, actions) {
        // console.log('three onWillUpdate', state, prev, actions)
      },
      onDidUpdate (state, prev, actions) {
        // console.log('three onDidUpdate', state, prev, actions)
      },
      onWillUnmount (elm, state, prev, actions) {
        // console.log('three onWillUnmount', elm, state, prev, actions)
      },
      view: viewThree,
    },
  },
})

const node = document.createElement('div')
document.body.appendChild(node)
app(node)
