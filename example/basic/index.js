const sakura = require('../../src')
const html = require('../../src/html')

function viewOne (state, prev, methods) {
  return html`
    <div>
      <a href="/foo/bar">To bar</a>
      <hr />
      <hr />
      <span><input value=${state.title} oninput=${(e) => methods.set(e.target.value)} />${state.title}</span>
      <hr />
      <span><button onclick=${() => methods.counter.increment()}>inc ${state.counter.count}</button></span>
      <span><button onclick=${() => methods.counter.incrementAsync()}>inc ${state.counter.count}</button></span>
      <hr />
      <span><input value=${state.counter.secondTitle.title} oninput=${(e) => methods.counter.secondTitle.update(e.target.value)} />${state.counter.secondTitle.title}</span>
      <hr />
    </div>
  `
}
function viewTwo (state, prev, methods) {
  return html`
    <div>
      <a href="/foo">To foo</a>
      <hr />
      <hr />
      <span><input value=${state.title} oninput=${(e) => methods.set(e.target.value)} />${state.title}</span>
      <hr />
      <span><button onclick=${() => methods.counter.increment()}>inc ${state.counter.count}</button></span>
      <span><button onclick=${() => methods.counter.incrementAsync()}>inc ${state.counter.count}</button></span>
      <hr />
      <span><input value=${state.counter.secondTitle.title} oninput=${(e) => methods.counter.secondTitle.update(e.target.value)} />${state.counter.secondTitle.title}</span>
      <hr />
    </div>
  `
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
  ],
  onMethodCall (state, prev) {
    console.info('State updated', state, prev)
  }
})

document.body.appendChild(app())
