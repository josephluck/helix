import * as yoyo from 'yo-yo'
import helix, { Helix } from '../'
const html = yoyo

function render(mount: HTMLElement): Helix.Renderer<State, Actions> {
  let _dom = mount
  return function (route, state, prev, actions) {
    if (route) {
      _dom = yoyo.update(_dom, route(state, prev, actions))
    }
  }
}

let numberOfTimesRendered: number = 0

const Navigation: Helix.Component<State, Actions> = (state, prev, actions) => html`
  <div>
    <a href='/' id='go-to-home'>
      HomeLink
    </a>
    <br />>
    <a href='/page-one' id='go-to-page-one'>
      PageOneLink
    </a>
    <br />
    <span id='go-to-page-one-programatically' onclick=${() => actions.location.set('/page-one')}>
      PageOneProgramaticLink
    </span>
    <br />
    <a href='/page-one?query=wiggle' id='go-to-page-one-query'>
      PageOneLinkQuery
    </a>
    <br />
    <a href='/page-two/bar' id='go-to-page-two-bar'>
      PageTwoLinkBar
    </a>
    <br />
    <a href='/page-two/bar?query=wiggle' id='go-to-page-two-bar-query'>
      PageTwoLinkBarQuery
    </a>
    <br />
    <a href='/page-three' id='go-to-page-three'>
      PageThreeLink
    </a>
    <br />
    <a href='/page-four' id='go-to-page-four'>
      PageFourLink
    </a>
    <br />
    <a href='/page-five/bar' id='go-to-page-five-bar'>
      PageFiveLinkBar
    </a>
    <br />
    <a href='/page-five/baz' id='go-to-page-five-baz'>
      PageFiveLinkBaz
    </a>
    <br />
    <a href='/page-five/bar?query=wiggle' id='go-to-page-five-bar-query'>
      PageFiveLinkBarQuery
    </a>
    <br />
    <a href='/page-five/bar?query=wiggle&something=else' id='go-to-page-five-bar-query-2'>
      PageFiveLinkBarQuery2
    </a>
    <br />
    <a href='/page-six/bar/baz' id='go-to-page-six-bar-baz'>
      PageSixLinkBarBaz
    </a>
    <br />
  </div>
`

const Layout = (child: Helix.Component<State, Actions>): Helix.Component<State, Actions> => (state, prev, actions) => {
  numberOfTimesRendered++
  return html`
    <div>
      <p id='number-of-times-rendered'>${numberOfTimesRendered}</p>
      ${Navigation(state, prev, actions)}
      <p id='router-params'>${JSON.stringify(state.location.params)}</p>
      <p id='router-query'>${JSON.stringify(state.location.query)}</p>
      <button
        id='increment-counter-button'
        type='button'
        onclick=${() => actions.setState({ count: state.count + 1 })}
      >
        ${state.count}
      </button>
      <p id='on-enter-call-count'>${state.onEnterCallCount}</p>
      <p id='on-leave-call-count'>${state.onLeaveCallCount}</p>
      <p id='on-update-call-count'>${state.onUpdateCallCount}</p>
      ${child(state, prev, actions)}
    </div>
  `
}

interface ModelState {
  count: number
  onEnterCallCount: number
  onLeaveCallCount: number
  onUpdateCallCount: number
}

type State = Helix.HelixState<ModelState>

interface Reducers {
  setState: Helix.Reducer<ModelState, Partial<ModelState>>
  increment: Helix.Reducer<ModelState>
}

interface Effects { }

type ModelActions = Helix.Actions<Reducers, Effects>
type Actions = Helix.HelixActions<ModelActions>

function model(): Helix.Model<ModelState, Reducers, Effects> {
  return {
    state: {
      count: 0,
      onEnterCallCount: 0,
      onLeaveCallCount: 0,
      onUpdateCallCount: 0,
    },
    reducers: {
      setState: (state, newState) => newState,
      increment: (state) => ({ count: state.count + 1 }),
    },
  }
}

function routes(): Helix.Routes<State, Actions> {
  return {
    '/': Layout(
      (state, prev, actions) => html`
      <div id='home'>
        HomeContent
      </div>
    `,
    ),
    '/page-one': Layout(
      (state, prev, actions) => html`
      <div id='page-one'>
        PageOneContent
      </div>
    `,
    ),
    '/page-two/:foo': Layout(
      (state, prev, actions) => html`
      <div id='page-two'>
        PageTwoContent
      </div>
    `,
    ),
    '/page-three': {
      onEnter: (state, prev, actions) =>
        actions.setState({ onEnterCallCount: state.onEnterCallCount + 1 }),
      view: Layout(
        (state, prev, actions) => html`
        <div id='page-three'>
          PageThreeContent
        </div>
      `,
      ),
    },
    '/page-four': {
      onLeave: (state, prev, actions) =>
        actions.setState({ onLeaveCallCount: state.onLeaveCallCount + 1 }),
      view: Layout(
        (state, prev, actions) => html`
        <div id='page-four'>
          PageFourContent
        </div>
      `,
      ),
    },
    '/page-five/:foo': {
      onUpdate: (state, prev, actions) =>
        actions.setState({ onUpdateCallCount: state.onUpdateCallCount + 1 }),
      onLeave: (state, prev, actions) =>
        actions.setState({ onLeaveCallCount: state.onLeaveCallCount + 1 }),
      view: Layout(
        (state, prev, actions) => html`
        <div id='page-five'>
          PageFiveContent
        </div>
      `,
      ),
    },
    '/page-six/:foo/:bar': {
      onUpdate: (state, prev, actions) =>
        actions.setState({ onUpdateCallCount: state.onUpdateCallCount + 1 }),
      view: Layout(
        (state, prev, actions) => html`
        <div id='page-six'>
          PageSixContent
        </div>
      `,
      ),
    },
    notFound: () => () => html`<p>Not found</p>`,
  }
}

const app1 = document.createElement('div')
document.body.appendChild(app1)

helix({
  model: model(),
  routes: routes(),
  render: render(app1),
})

const app2 = document.createElement('div')
document.body.appendChild(app2)

function component(): Helix.Component<State, Actions> {
  return function (state, prev, actions) {
    return html`
      <div>
        <a href='#' id='app-2-anchor'>AppTwoAnchor</a>
        <button type='button'
          id='increment-app-2-count'
          onclick=${actions.increment}
        >
          ${state.count}
        </button>
      </div>
    `
  }
}

helix({
  model: model(),
  component: component(),
  render: render(app2),
})
