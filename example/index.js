const sakura = require('../src')
const html = require('../src/html')

function viewOne (state, prev, methods) {
  return html`
    <div>
      <h1>View one ${state.title}</h1>
      <a href="/bar">Switch to view two</a>
      <a href="/foo/bar">Switch to view three</a>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
    </div>
  `
}

function viewTwo (state, prev, methods) {
  return html`
    <div>
      <h1>View two ${state.title}</h1>
      <a href="/foo">Switch to view one</a>
      <a href="/foo/bar">Switch to view three</a>
      <input value=${state.title} oninput=${(e) => methods.updateTitle(e.target.value)} />
    </div>
  `
}

function viewThree (state, prev, methods) {
  return html`
    <div>
      <h1>View three ${state.title}</h1>
      <a href="/foo">Switch to view one</a>
      <a href="/bar">Switch to view two</a>
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
    ['/foo', viewOne],
    ['/foo/bar', viewThree],
    ['/bar', viewTwo],
  ]
})

document.body.appendChild(app())
