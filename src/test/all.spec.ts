import browser from 'nightmare'
import { base } from './setup'
require('./setup.ts')

describe('test setup', () => {
  test('it sets up the test correctly', async () => {
    const page = browser().goto(base)
    const body = await page.evaluate(() => document.body.innerHTML.trim())
    page.end()

    expect(body).toContain('HomeContent')
  })
})

describe('rendering', () => {
  test('it only renders once on page load', async () => {
    const page = browser().goto(base)
    const renderCount = await page.evaluate(() => document.querySelector('#number-of-times-rendered').innerHTML.trim())
    page.end()

    expect(renderCount).toEqual('1')
  })

  test('it renders model state', async () => {
    const page = browser().goto(base)
    const count = await page.evaluate(() => document.querySelector('#increment-counter-button').innerHTML.trim())
    page.end()

    expect(count).toEqual('0')
  })

  test('it rerenders model state changes', async () => {
    const page = browser().goto(base)
    await page.click('#increment-counter-button')
    const count = await page.evaluate(() => document.querySelector('#increment-counter-button').innerHTML.trim())
    const renderCount = await page.evaluate(() => document.querySelector('#number-of-times-rendered').innerHTML.trim())
    page.end()

    expect(count).toEqual('1')
    expect(renderCount).toEqual('2')
  })

  test('it persists model state across pages', async () => {
    const page = browser().goto(base)
    await page.click('#increment-counter-button')
    await page.click('#go-to-page-one').wait('#page-one')
    const count = await page.evaluate(() => document.querySelector('#increment-counter-button').innerHTML.trim())
    const renderCount = await page.evaluate(() => document.querySelector('#number-of-times-rendered').innerHTML.trim())
    page.end()

    expect(count).toEqual('1')
    expect(renderCount).toEqual('3')
  })
})

describe('navigation & params', () => {
  test('it can navigate between pages', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-one').wait('#page-one')
    const content = await page.evaluate(() => document.body.innerHTML.trim())
    page.end()

    expect(content).toContain('PageOneContent')
  })

  test('it can navigate between pages programatically', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-one-programatically').wait('#page-one')
    const content = await page.evaluate(() => document.body.innerHTML.trim())
    page.end()

    expect(content).toContain('PageOneContent')
  })

  test('it displays router url params', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-two-bar')
    const content = await page.evaluate(() => document.querySelector('#router-params').innerHTML.trim())
    page.end()

    expect(JSON.parse(content).foo).toEqual('bar')
  })

  test('it displays multiple router url params', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-six-bar-baz')
    const content = await page.evaluate(() => document.querySelector('#page-six').innerHTML.trim())
    const params = await page.evaluate(() => document.querySelector('#router-params').innerHTML.trim())
    page.end()

    expect(content).toContain('PageSixContent')
    expect(JSON.parse(params).foo).toEqual('bar')
    expect(JSON.parse(params).bar).toEqual('baz')
  })

  test('it displays query params', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-one-query')
    const query = await page.evaluate(() => document.querySelector('#router-query').innerHTML.trim())
    page.end()

    expect(JSON.parse(query).query).toEqual('wiggle')
  })

  test('it doesnt get confused when a query param is after a url param', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-two-bar-query')
    const params = await page.evaluate(() => document.querySelector('#router-params').innerHTML.trim())
    const query = await page.evaluate(() => document.querySelector('#router-query').innerHTML.trim())
    page.end()

    expect(JSON.parse(params).foo).toEqual('bar')
    expect(JSON.parse(query).query).toEqual('wiggle')
  })

  test('it rerenders when query params change', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-one')
    await page.click('#go-to-page-one-query')
    const renderCount = await page.evaluate(() => document.querySelector('#number-of-times-rendered').innerHTML.trim())
    page.end()

    expect(renderCount).toEqual('3')
  })

  test('it rerenders when query params change on the same route', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-five-bar-query')
    await page.click('#go-to-page-five-bar-query-2')
    const renderCount = await page.evaluate(() => document.querySelector('#number-of-times-rendered').innerHTML.trim())
    page.end()

    expect(renderCount).toEqual('4') // Page 5 has an onUpdate hook
  })
})

describe('route lifecycle hooks', () => {
  test('it calls the onEnter hook when a page is visited', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-three')
    const content = await page.evaluate(() => document.querySelector('#on-enter-call-count').innerHTML.trim())
    page.end()

    expect(content).toEqual('1')
  })

  test('it calls the onEnter hook multiple times when a page is visited multiple times', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-three')
    await page.click('#go-to-page-one')
    await page.click('#go-to-page-three')
    const content = await page.evaluate(() => document.querySelector('#on-enter-call-count').innerHTML.trim())
    page.end()

    expect(content).toEqual('2')
  })

  test('it calls the onLeave hook when a page is left', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-four')
    await page.click('#go-to-page-one')
    const content = await page.evaluate(() => document.querySelector('#on-leave-call-count').innerHTML.trim())
    page.end()

    expect(content).toEqual('1')
  })

  test('it calls the onLeave hook multiple times when a page is left multiple times', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-four')
    await page.click('#go-to-page-one')
    await page.click('#go-to-page-four')
    await page.click('#go-to-page-one')
    const content = await page.evaluate(() => document.querySelector('#on-leave-call-count').innerHTML.trim())
    page.end()

    expect(content).toEqual('2')
  })

  test('it calls the onUpdate hook when url parameters update', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-five-bar')
    await page.click('#go-to-page-five-baz')
    const content = await page.evaluate(() => document.querySelector('#on-update-call-count').innerHTML.trim())
    page.end()

    expect(content).toEqual('1')
  })

  test('it calls the onUpdate hook multiple times when url parameters update multiple times', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-five-bar')
    await page.click('#go-to-page-five-baz')
    await page.click('#go-to-page-five-bar')
    const content = await page.evaluate(() => document.querySelector('#on-update-call-count').innerHTML.trim())
    page.end()

    expect(content).toEqual('2')
  })

  test('it calls the onUpdate hook when query parameters update', async () => {
    const page = browser().goto(base)
    await page.click('#go-to-page-five-bar')
    await page.click('#go-to-page-five-bar-query')
    const content = await page.evaluate(() => document.querySelector('#on-update-call-count').innerHTML.trim())
    page.end()

    expect(content).toEqual('1')
  })
})

describe('component usage', () => {
  test('it renders model state', async () => {
    const page = browser().goto(base)
    const count = await page.evaluate(() => document.querySelector('#increment-app-2-count').innerHTML.trim())
    page.end()

    expect(count).toEqual('0')
  })

  test('it rerenders on model state change', async () => {
    const page = browser().goto(base)
    await page.click('#increment-app-2-count')
    const count = await page.evaluate(() => document.querySelector('#increment-app-2-count').innerHTML.trim())
    page.end()

    expect(count).toEqual('1')
  })

  test.skip('it doesn\'t capture click events on anchor tags', async () => {
    // const page = browser().goto(base)
    // await page.click('#increment-app-2-count')
    // const count = await page.evaluate(() => document.querySelector('#increment-app-2-count').innerHTML.trim())
    // page.end()

    // expect(count).toEqual('1')
  })
})
