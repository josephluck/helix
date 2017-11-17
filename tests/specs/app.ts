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

  after(browser, done) {
    server.stop()
    done()
  }
}
