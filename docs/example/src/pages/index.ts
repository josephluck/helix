import home from '../pages/home/page'
import post from '../pages/post/page'
import login from '../pages/login/page'
import newPost from '../pages/new/page'
import settings from '../pages/settings/page'

export default function routes () {
  return {
    '': home(),
    'posts/:postId': post(),
    'posts/new': newPost(),
    'login': login(),
    'settings': settings(),
  }
}
