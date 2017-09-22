import browser from 'nightmare'
import { base } from './test-setup'
require('./test-setup.ts')

test('it sets up the test correctly', async () => {
  const page = browser().goto(base)
  const body = await page.evaluate(() => document.body.innerHTML).end()

  expect(body).toContain('HomeContent')
})

test('it can navigate between pages', async () => {
  const page = browser().goto(base)
  const body = await page.click('#go-to-page-one')
    .wait('#page-one')
    .evaluate(() => document.body.innerHTML).end()

  expect(body).toContain('PageOneContent')
})

test('it only renders once on page load', async () => {
  const page = browser().goto(base)
  const elm = await page.evaluate(() => document.querySelector('#number-of-times-rendered').innerHTML.trim()).end()
  expect(elm).toEqual('1')
})

test('it renders model state', async () => {
  const page = browser().goto(base)
  const elm = await page.evaluate(() => document.querySelector('#increment-counter-button').innerHTML.trim()).end()
  expect(elm).toEqual('0')
})
