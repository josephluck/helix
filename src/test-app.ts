import * as yoyo from 'yo-yo'
import helix from './'
const html = yoyo

let _dom = document.createElement('div')
document.body.appendChild(_dom)
const render = (route, state, prev, actions) => {
  _dom = yoyo.update(_dom, route(state, prev, actions))
}

let numberOfTimesRendered = 0

const Navigation = () => html`
  <div>
    <a href='/' id='go-to-home'>
      PageOneLink
    </a>
    <a href='/page-one' id='go-to-page-one'>
      HomeLink
    </a>
  </div>
`

const Layout = child => (state, prev, actions) => {
  numberOfTimesRendered++
  return html`
    <div>
      <p id='number-of-times-rendered'>${numberOfTimesRendered}</p>
      ${Navigation()}
      <button
        id='increment-counter-button'
        type='button'
        onclick=${actions.increment}
      >
        ${state.count}
      </button>
      ${child(state, prev, actions)}
    </div>
  `
}

helix({
  model: {
    state: {
      count: 0,
    },
    reducers: {
      increment: (state) => ({ count: state.count + 1 }),
    },
  },
  routes: {
    '/': Layout((state, prev, actions) => html`
      <div id='home'>
        HomeContent
      </div>
    `),
    '/page-one': Layout((state, prev, actions) => html`
      <div id='page-one'>
        PageOneContent
      </div>
    `),
    notFound: () => html`<p>Not found</p>`,
  },
  render,
})
