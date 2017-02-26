require('es6-shim')
import helix from '../../../src'
import { h } from '../../../src/html'

function Links () {
  return (
    <div>
      <a style='margin-right: 10px;' href='/foo'>view one</a>
      <a style='margin-right: 10px;' href='/foo/bar'>view two</a>
      <a style='margin-right: 10px;' href='/foo/bar/123'>view three (123)</a>
      <a style='margin-right: 10px;' href='/foo/bar/abc'>view three (abc)</a>
    </div>
  )
}

function viewOne ({state, prev, actions}) {
  return (
    <div>
      <Links />
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
      <Links />
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
      <Links />
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
    'foo': viewOne,
    'foo/bar': viewTwo,
    'foo/bar/:baz': viewThree,
  },
})

const node = document.createElement('div')
document.body.appendChild(node)
app(node)
