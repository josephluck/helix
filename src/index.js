const tansu = require('tansu')
const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const href = require('sheet-router/href')
const html = require('./html')
const h = html.h

function createModel (model) {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: {
        scoped: true,
        state: window.location,
        reducers: {
          set (state, location) {
            window.history.pushState('', '', location)
            return window.location
          }
        }
      }
    })
  })
}

module.exports = function (opts) {
  let state
  let prev
  let methods
  let router = sheetRouter({ thunk: false }, opts.routes)

  function cycle (renderer) {
    function render (_state, _prev, child) {
      console.log('cycle render called', child)
      const props = {
        state: _state ? _state : state,
        prev: _prev ? _prev : prev,
        methods: methods
      }
      return renderer(props, child)
    }

    // Subscribe to store updates
    const store = tansu(function (a, b, c) {
      console.log('tansu subscription called', a, b, c)
    })(createModel(opts.model))

    state = store.state
    prev = store.state
    methods = store.methods

    walk(router, (route, cb) => {
      return (params) => {
        console.log('should render page', cb())
        // render()
        return cb
      }
    })

    let child = router(window.location.href)
    render(state, prev, child)
  }

  function renderer (component, parent) {
    let dom = null

    return function (props, child) {
      console.log('rendering with props', props, child)
      dom = html.render(h(child, props), parent, dom)
    }
  }

  return function render (mount) {
    let component = ({state, prev, methods}) => {
      console.log('rendering app', state, prev, methods)
      return (
        <div>Hey</div>
      )
    }
    let _renderer = renderer(component, mount)
    return cycle(_renderer)
  }
}

// module.exports = function (opts) {
//   let router = sheetRouter({ thunk: false }, opts.routes)
//   if (!opts.model.models) {
//     opts.model.models = {}
//   }

//   const store = tansu({
//     onStateChange: (state, prev) => {
//       console.log('should re-render current page')
//     }
//   })(createModel(opts.model))

//   walk(router, (route, cb) => {
//     return (params) => {
//       console.log('should render page')
//     }
//   })

//   href(function (href) {
//     store.methods.location.set(href.pathname)
//   })

//   return function (mount) {
//     console.log('should render app for first time')
//   }
// }
