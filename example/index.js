const sakura = require('../src')
const html = require('../src/html')

function viewOne (state, prev, methods) {
  console.log('view one', state)
  return html`
    <div onload=${() => console.log('view one loaded')}>
      <h1>View one ${state.title}</h1>
      <a href="/bar">Switch to view two</a>
      <span onclick=${() => methods.location.set('/foo/bar')}>Switch to view three</span>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
    </div>
  `
}

function viewTwo (state, prev, methods) {
  console.log('view two', state)
  return html`
    <div onload=${() => console.log('view two loaded')}>
      <h1>View two ${state.title}</h1>
      <a href="/foo">Switch to view one</a>
      <span onclick=${() => methods.location.set('/foo/bar')}>Switch to view three</span>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
    </div>
  `
}

function viewThree (state, prev, methods) {
  console.log('view three', state)
  return html`
    <div onload=${() => console.log('view three loaded')}>
      <h1>View three ${state.title}</h1>
      <a href="/foo">Switch to view one</a>
      <a href="/bar">Switch to view two</a>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
      <button onclick=${() => methods.counter.increment()}>Increment ${state.counter.count}</button>
      <button onclick=${() => methods.counter.incrementAsync()}>Increment async ${state.counter.count}</button>
    </div>
  `
}

const app = sakura({
  model: {
    state: {
      title: 'foo'
    },
    reducers: {
      updateTitle (state, title) {
        return Object.assign({}, state, {
          title
        })
      }
    },
    models: {
      counter: {
        state: {
          count: 0
        },
        reducers: {
          increment (state) {
            return Object.assign({}, state, {
              counter: Object.assign({}, state.counter, {
                count: state.counter.count + 1
              })
            })
          }
        },
        effects: {
          incrementAsync (state, methods) {
            setTimeout(() => {
              methods.counter.increment()
            }, 1000)
          }
        }
      }
    }
  },
  routes: [
    ['/foo', viewOne],
    ['/foo/bar', viewThree],
    ['/bar', viewTwo],
  ]
})

document.body.appendChild(app())
