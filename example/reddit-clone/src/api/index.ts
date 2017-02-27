import walk from '../utils/walk'
import promisify from '../utils/promisify'
import authResponse from './fixtures/authResponse'

export default walk({
  login (username, password) {
    if (username === 'joseph@example.com' && password === 'password') {
      return authResponse()
    }
    return new Error('Whoops! Please try again...')
  },
}, promisify)
