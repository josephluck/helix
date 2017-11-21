import { Helix } from '../../../../src'
import * as Alert from './alert'
import * as User from './user'
import * as Login from './login'
import * as Posts from './posts'
import * as Post from './post'
import * as NewPost from './new-post'
import * as Settings from './settings'

export type Models = Helix.Models<
  Helix.ModelApi<Alert.State, Alert.Actions> &
  Helix.ModelApi<Login.State, Login.Actions> &
  Helix.ModelApi<NewPost.State, NewPost.Actions> &
  Helix.ModelApi<Post.State, Post.Actions> &
  Helix.ModelApi<Posts.State, Posts.Actions> &
  Helix.ModelApi<Settings.State, Settings.Actions> &
  Helix.ModelApi<User.State, User.Actions>
  >

export type GlobalState = Models['state']
export type GlobalActions = Models['actions']

export default function model() {
  return {
    state: {},
    models: {
      alert: Alert.model(),
      login: Login.model(),
      newPost: NewPost.model(),
      post: Post.model(),
      posts: Posts.model(),
      settings: Settings.model(),
      user: User.model(),
    },
  }
}
