// Global domains
import alert from './alert'
import user from './user'

// Pages
import login from '../pages/login/model'
import home from '../pages/home/model'
import post from '../pages/post/model'

export default function model () {
  return {
    state: {},
    models: {
      alert: alert(),
      user: user(),
      pages: {
        state: {},
        models: {
          login: login(),
          home: home(),
          post: post(),
        },
      },
    },
  }
}
