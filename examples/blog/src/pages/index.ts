import { Helix } from '../../../../src'
import { GlobalState, GlobalActions } from '../models' 
import home from './home'
import post from './post'
import login from './login'
import newPost from './new-post'
import settings from './settings'

export default function routes(): Helix.Routes<GlobalState, GlobalActions> {
  return {
    '/': home(),
    '/posts/:postId': post(),
    '/posts/new': newPost(),
    '/login': login(),
    '/settings': settings(),
  }
}
