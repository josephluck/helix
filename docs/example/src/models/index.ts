import { Helix } from '../../../../src'
import * as Alert from './alert'
import * as Login from './login'
import * as NewPost from './new-post'
import * as Post from './post'
import * as Posts from './posts'
import * as Settings from './settings'
import * as User from './user'
import { Twine } from 'twine-js'
export { Twine } from 'twine-js'

export type Models = Twine.Models<
  {
    alert: Helix.ModelApi<Alert.State, Alert.Actions>
  } & {
    login: Helix.ModelApi<Login.State, Login.Actions>
  } & {
    newPost: Helix.ModelApi<NewPost.State, NewPost.Actions>
  } & {
    post: Helix.ModelApi<Post.State, Post.Actions>
  } & {
    posts: Helix.ModelApi<Posts.State, Posts.Actions>
  } & {
    settings: Helix.ModelApi<Settings.State, Settings.Actions>
  } & {
    user: Helix.ModelApi<User.State, User.Actions>
  }
>

export type GlobalState = Helix.HelixState<Models['state']>
export type GlobalActions = Helix.HelixActions<Models['actions']>

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
