import alert from './alert'
import user from './user'
import login from '../pages/login/model'
import home from '../pages/home/model'
import post from '../pages/post/model'
import newPost from '../pages/new/model'
import settings from '../pages/settings/model'

export default function model() {
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
          newPost: newPost(),
          settings: settings(),
        },
      },
    },
  }
}
