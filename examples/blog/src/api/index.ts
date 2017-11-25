import authResponse, { AuthResponse } from './fixtures/authResponse'
import post, { Post } from './fixtures/post'
import comment, { Comment } from './fixtures/comment'

const timeout = 2000 // Simulate Async

export default {
  login(user, username, password): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user.password !== password || user.username !== username) {
          reject('Whoops! Please try again...')
        } else {
          resolve(authResponse())
        }
      }, timeout)
    })
  },
  fetchPosts(): Promise<Post[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Array.from({ length: 10 }).map(() => post()))
      }, timeout)
    })
  },
  fetchPost(): Promise<Post> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(post())
      }, timeout)
    })
  },
  newPost(title: string, body: string): Promise<Post> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...post(),
          title,
          body: [body],
        })
      }, timeout)
    })
  },
  newComment(body: string, user): Promise<Comment> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...comment(),
          createdOn: new Date(),
          createdBy: user,
          body,
        })
      }, timeout)
    })
  },
}
