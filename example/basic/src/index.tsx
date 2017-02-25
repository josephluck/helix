require('es6-shim')
import sakura from '../../../src'
import { createElement } from '../../../src/html'

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

function viewOne ({state, prev, methods}) {
  // console.log('view one', state)
  return (
    <div>
      <Links />
      <h1>view one</h1>
      {state.title}
      <div>
        <input value={state.title} onInput={(e: any) => methods.set(e.target.value)} />
      </div>
    </div>
  )
}
function viewTwo ({state, prev, methods}) {
  // console.log('view two', state)
  return (
    <div>
      <Links />
      <h1>view two</h1>
      {state.title}
      <div>
        <input value={state.title} onInput={(e: any) => methods.set(e.target.value)} />
      </div>
    </div>
  )
}
function viewThree ({state, prev, methods}) {
  // console.log('view three', state)
  return (
    <div>
      <Links />
      <h1>view three {state.location.params.baz}</h1>
      {state.title}
      <div>
        <input value={state.title} onInput={(e: any) => methods.set(e.target.value)} />
      </div>
    </div>
  )
}

const app = sakura({
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
          incrementAsync (state, methods) {
            setTimeout(() => {
              methods.increment(5)
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
