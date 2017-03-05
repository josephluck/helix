import home from '../pages/home/page'
import post from '../pages/post/page'
import login from '../pages/login/page'
import newPost from '../pages/new/page'
import base from '../pages/base'

export default function routes () {
  return {
    '': home(),
    'posts/:postId': post(),
    'posts/new': base(newPost),
    'login': base(login),
  }
}
