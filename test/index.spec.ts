const test = require('tape')
const view = require('../src/index')

test('view / setup / returns a function', function (t) {
  t.pass('example pass')
  // t.fail('example fail')
})

test('view / setup / calling setup with a node render it', function (t) {
  t.plan(1)
  // const app = view({
  //   model: {
  //     state: {
  //       title: 'not set'
  //     }
  //   },
  //   routes: [['', function () {
  //     return html`<div onload=${() => t.pass('rendered the node')}>I rendered</div>`
  //   }]]
  // })
  t.pass()
})