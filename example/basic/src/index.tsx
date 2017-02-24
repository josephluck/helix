require('es6-shim')
import sakura from '../../../src'
import {h, Component} from '../../../src/html'

interface CounterState {
  count: number
}

class Counter extends Component<undefined, CounterState> {
  constructor () {
    super()
    this.state = {
      count: 0
    }
  }
  increment () {
    this.setState({
      count: this.state.count + 1
    })
  }
  render () {
    return (
      <div>
        <button onClick={() => this.increment()}>{this.state.count} inc</button>
      </div>
    )
  }
}

function Links () {
  return (
    <div>
      <a href="/foo">To foo</a>
      <a href="/foo/bar">To bar</a>
      <a href="/foo/bar/123">To baz 123</a>
      <a href="/foo/bar/abc">To baz abc</a>
    </div>
  )
}

function viewOne ({state, prev, methods}) {
  return (
    <div>
      <Links />
      {state.title}
      <input value={state.title} onInput={(e: any) => methods.set(e.target.value)} />
      <div><Counter /></div>
    </div>
  )
}
function viewTwo ({state, prev, methods}) {
  return (
    <div>
      <Links />
      {state.title}
      <input value={state.title} onInput={(e: any) => methods.set(e.target.value)} />
      <Counter />
    </div>
  )
}
function viewThree ({state, prev, methods}) {
  console.log(state)
  return (
    <div>
      <Links />
      {state.title}
      <input value={state.title} onInput={(e: any) => methods.set(e.target.value)} />
      <Counter />
    </div>
  )
}

const app = sakura({
  model: {
    state: {
      title: 'not set'
    },
    reducers: {
      set (state, title) {
        return Object.assign({}, state, {
          title: title
        })
      }
    },
    models: {
      counter: {
        scoped: true,
        state: {
          count: 1
        },
        reducers: {
          increment (state, amount) {
            return {
              count: state.count + (amount || 1)
            }
          },
        },
        effects: {
          incrementAsync (state, methods) {
            setTimeout(() => {
              methods.increment(5)
            }, 1000)
          }
        },
        models: {
          secondTitle: {
            scoped: true,
            state: {
              title: 'hey'
            },
            reducers: {
              update (state, title) {
                return {
                  title: title
                }
              }
            }
          }
        }
      },
      foo: {
        state: {
          bar: 'baz'
        }
      }
    }
  },
  routes: [
    ['/foo', viewOne],
    ['/foo/bar', viewTwo],
    ['/foo/bar/:baz', viewThree],
  ]
})

app(document.body)
