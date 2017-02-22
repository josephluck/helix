const sakura = require('../src')
const html = require('../src/html')

function viewOne (state, prev, methods) {
  return html`
    <div>
      <h1>View one ${state.title}</h1>
      <a href="/foo">Switch to view two</a>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
    </div>
  `
}

function viewTwo (state, prev, methods) {
  return html`
    <div>
      <h1>View two ${state.title}</h1>
      <a href="/">Switch to view one</a>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
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
        return {
          title
        }
      }
    }
  },
  routes: [
    ['', viewOne],
    ['/foo', viewTwo]
  ]
})

document.body.appendChild(app())
