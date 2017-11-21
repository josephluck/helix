import alert from './alert'
import user from './user'
import login from './login'
import posts from './posts'
import post from './post'
import newPost from './new-post'
import settings from './settings'

export default function model() {
  return {
    state: {},
    models: {
      alert: alert(),
      user: user(),
      login: login(),
      posts: posts(),
      post: post(),
      newPost: newPost(),
      settings: settings(),
    },
  }
}
