import home from '../pages/home/page'
import login from '../pages/login/page'
import base from '../pages/base'

export default function routes () {
  return {
    '': base(home),
    'login': base(login),
  }
}
