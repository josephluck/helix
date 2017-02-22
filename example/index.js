const sakura = require('../src')
const html = require('../src/html')

function viewOne (state, prev, methods) {
  return html`
    <div onload=${() => console.log('view one loaded')} onunload=${() => console.log('view one unloaded')}>
      <h1>View one ${state.title}</h1>
      <a href="/bar">Switch to view two</a>
      <span onclick=${() => methods.location.set('/foo/bar')}>Switch to view three</span>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
    </div>
  `
}

function viewTwo (state, prev, methods) {
  return html`
    <div onload=${() => console.log('view two loaded')} onunload=${() => console.log('view two unloaded')}>
      <h1>View two ${state.title}</h1>
      <a href="/foo">Switch to view one</a>
      <span onclick=${() => methods.location.set('/foo/bar')}>Switch to view three</span>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
    </div>
  `
}

function viewThree (state, prev, methods) {
  return html`
    <div onload=${() => console.log('view three loaded')} onunload=${() => console.log('view three unloaded')}>
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
  ],
  onMethodCall (state, prev) {
    console.info('State updated', state, prev)
  }
})

document.body.appendChild(app())
