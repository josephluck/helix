import * as html from 'yo-yo'
import { User } from '../api/fixtures/user'

export interface Props {
  user: null | User
  onAvatarClick: () => any
  redirect: string
}

function loginLink(redirect: string) {
  return html`
    <a
      class='ml3 no-underline blue'
      href=${`/login?redirect=${redirect}`}
    >
      Login
    </a>
  `
}

function avatar(src: string, onclick: () => any) {
  return html`
    <div class='inline-flex items-center'>
      <img
        class='mr2 br-pill w2 h2 overflow-hidden'
        src=${src}
        onclick=${onclick}
      />
    </div>
  `
}

export default function navigation({ user, onAvatarClick, redirect }: Props) {
  return html`
    <div class='pv4 h3 ttu b f6 flex items-center'>
      <div class='flex-auto'>
        <span class='mr3'>Bloggy</span>
        <a class='mr2 no-underline blue' href='/posts/new'>
          New post
        </a>
        <a class='mr2 no-underline blue' href='/'>
          Posts
        </a>
      </div>
      <div>
        ${user ? avatar(user.avatar, onAvatarClick) : loginLink(redirect)}
      </div>
    </div>
  `
}
