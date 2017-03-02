import walk from '../utils/walk'
import promisify from '../utils/promisify'
import authResponse from './fixtures/authResponse'
import { fixture as user } from './fixtures/user'
import post from './fixtures/post'

export default walk({
  login (username, password) {
    console.log(username, password, user)
    if (username === user.username && password === user.password) {
      return authResponse()
    }
    return new Error('Whoops! Please try again...')
  },
  fetchPosts () {
    return Array.from({ length: 10 }).map(() => post())
  },
  fetchPost () {
    return post()
  },
}, promisify)
