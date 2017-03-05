import walk from '../utils/walk'
import promisify from '../utils/promisify'
import authResponse from './fixtures/authResponse'
import post from './fixtures/post'
import comment from './fixtures/comment'

export default walk({
  login (user, username, password) {
    if (user.password !== password || user.username !== username) {
      return new Error('Whoops! Please try again...')
    }
    return authResponse()
  },
  fetchPosts () {
    return Array.from({ length: 10 }).map(() => post())
  },
  fetchPost () {
    return post()
  },
  newPost (title, body) {
    return post()
  },
  newComment (_comment, user) {
    return {
      ...comment(),
      createdOn: new Date(),
      createdBy: user,
      body: _comment,
    }
  }
}, promisify)
