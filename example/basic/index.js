const sakura = require('../../src')
const html = require('../../src/html')
const h = html.h

class Counter extends html.Component {
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
        <button onclick={() => this.increment()}>{this.state.count} inc</button>
      </div>
    )
  }
}

function viewOne ({state, prev, methods}) {
  return (
    <div>
      <a href="/foo/bar">To bar</a>
      {state.title}
      <input value={state.title} onInput={e => methods.set(e.target.value)} />
      <Counter />
    </div>
  )
}
function viewTwo ({state, prev, methods}) {
  return (
    <div>
      <a href="/foo">To foo</a>
      {state.title}
      <input value={state.title} onInput={e => methods.set(e.target.value)} />
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
  ]
})

app(document.body)
