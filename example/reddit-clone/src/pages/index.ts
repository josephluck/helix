import home from '../pages/home/page'
import post from '../pages/post/page'
import login from '../pages/login/page'
import newPost from '../pages/new/page'
import settings from '../pages/settings/page'
import base from '../pages/base'
import authenticate from '../pages/authenticate'

export default function routes () {
  return {
    '': home(),
    'posts/:postId': post(),
    'posts/new': authenticate(base(newPost)),
    'login': base(login),
    'settings': settings(),
  }
}
