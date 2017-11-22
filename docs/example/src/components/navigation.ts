import * as html from 'yo-yo'
import { User } from '../api/fixtures/user'

export interface Props {
  user: null | User
  onAvatarClick: () => any
}

export default function navigation({ user = null, onAvatarClick }: Props) {
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
        ${
          user
            ? html`
            <div class='inline-flex items-center'>
              <img
                class='mr2 br-pill w2 h2 overflow-hidden'
                src=${user.avatar}
                onclick=${onAvatarClick}
              />
            </div>
          `
            : html`
            <a class='ml3 no-underline blue' href='/login'>
              Login
            </a>
          `
        }
      </div>
    </div>
  `
}
