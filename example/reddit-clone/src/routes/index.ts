import login from '../pages/login/page'
import base from '../pages/base'

export default function routes () {
  return {
    'login': base(login),
  }
}
