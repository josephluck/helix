import home from './home'
import post from './post'
import login from './login'
import newPost from './new-post'
import settings from './settings'

export default function routes() {
  return {
    '/': home(),
    '/posts/:postId': post(),
    '/posts/new': newPost(),
    '/login': login(),
    '/settings': settings(),
  }
}
