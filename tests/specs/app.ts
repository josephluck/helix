import { NightwatchBrowser } from 'nightwatch'
import run from '../server'

let server

export default {
  before: async (browser, done) => {
    server = await run('./tmp/tests/apps/app.js')
    done()
  },

  'Sets up the test correctly'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('body')
      .text.to.contain('HomeContent')
    browser.end()
  },

  'It only renders once on page load'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('#number-of-times-rendered')
      .text.to.equal('1')
    browser.end()
  },

  'It renders model state'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.expect.element('#increment-counter-button')
      .text.to.equal('0')
    browser.end()
  },

  'It re-renders on model state changes'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#increment-counter-button')
    browser.expect.element('#increment-counter-button')
      .text.to.equal('1')
    browser.expect.element('#number-of-times-rendered')
      .text.to.equal('2')
    browser.end()
  },

  'It persists model state across pages'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#increment-counter-button')
    browser.click('#go-to-page-one')
    browser.expect.element('#increment-counter-button')
      .text.to.equal('1')
    browser.expect.element('#number-of-times-rendered')
      .text.to.equal('3')
    browser.end()
  },

  'It can navigate between pages programatically'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-one-programatically')
    browser.expect.element('body')
      .text.to.contain('PageOneContent')
    browser.end()
  },

  'It displays router url params'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-two-bar')
    browser.getText('#router-params', result => {
      browser.assert.equal(JSON.parse(result.value).foo, 'bar')
    })
    browser.end()
  },

  'It displays multiple router url params'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-two-bar')
    browser.getText('#router-params', result => {
      browser.assert.equal(JSON.parse(result.value).foo, 'bar')
      browser.assert.equal(JSON.parse(result.value).bar, 'baz')
    })
    browser.end()
  },

  'It displays query params'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-one-query')
    browser.getText('#router-query', result => {
      browser.assert.equal(JSON.parse(result.value).query, 'wiggle')
    })
    browser.end()
  },

  'It doesnt get confused when a query param is after a URL param'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-two-bar-query')
    browser.getText('#router-params', result => {
      browser.assert.equal(JSON.parse(result.value).foo, 'bar')
    })
    browser.getText('#router-query', result => {
      browser.assert.equal(JSON.parse(result.value).query, 'wiggle')
    })
    browser.end()
  },

  'It rerenders when query params change'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-one')
    browser.click('#go-to-page-one-query')
    browser.expect.element('#number-of-times-rendered')
      .text.to.equal('3')
    browser.end()
  },

  'It rerenders when query params change on the same route'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-five-bar-query')
    browser.click('#go-to-page-five-bar-query-2')
    browser.expect.element('#number-of-times-rendered')
      .text.to.equal('5')
    // Page 5 has an onUpdate & onLeave hook so +2 counts
    browser.end()
  },

  'It calls the onEnter hook when a page is visited'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-three')
    browser.click('#go-to-page-one')
    browser.click('#go-to-page-three')
    browser.expect.element('#on-enter-call-count')
      .text.to.equal('2')
    browser.end()
  },

  'It calls the onLeave hook when a page is left'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-four')
    browser.click('#go-to-page-one')
    browser.expect.element('#on-leave-call-count')
      .text.to.equal('1')
    browser.end()
  },

  'It calls the onLeave hook multiple times when the same page is left multiple times'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-four')
    browser.click('#go-to-page-one')
    browser.click('#go-to-page-four')
    browser.click('#go-to-page-one')
    browser.expect.element('#on-leave-call-count')
      .text.to.equal('2')
    browser.end()
  },

  'It calls the onLeave hook multiple times when switching between two pages that have onLeave'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-four')
    browser.click('#go-to-page-five-bar')
    browser.click('#go-to-page-four')
    browser.click('#go-to-page-five-baz')
    browser.expect.element('#on-leave-call-count')
      .text.to.equal('3')
    browser.end()
  },

  'It calls the onUpdate hook when the URL parameters change'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-five-bar')
    browser.click('#go-to-page-five-baz')
    browser.expect.element('#on-leave-call-count')
      .text.to.equal('1')
    browser.end()
  },

  'It calls the onUpdate hook multiple times when the URL parameters change'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-five-bar')
    browser.click('#go-to-page-five-baz')
    browser.click('#go-to-page-five-bar')
    browser.expect.element('#on-leave-call-count')
      .text.to.equal('2')
    browser.end()
  },

  'It calls the onUpdate hook when the query parameters change'(browser: NightwatchBrowser) {
    browser
      .url(server.domain)
      .waitForElementVisible('body', 2000)
    browser.click('#go-to-page-five-bar')
    browser.click('#go-to-page-five-bar-query')
    browser.expect.element('#on-leave-call-count')
      .text.to.equal('1')
    browser.end()
  },

  after(browser, done) {
    server.stop()
    done()
  }
}

// test('it renders model state', async () => {
//   const page = browser().goto(base)
//   const count = await page.evaluate(() =>
//     document.querySelector('#increment-app-2-count').innerHTML.trim(),
//   )
//   page.end()

//   expect(count).toEqual('0')
// })

// test('it rerenders on model state change', async () => {
//   const page = browser().goto(base)
//   await page.click('#increment-app-2-count')
//   const count = await page.evaluate(() =>
//     document.querySelector('#increment-app-2-count').innerHTML.trim(),
//   )
//   page.end()

//   expect(count).toEqual('1')
// })
