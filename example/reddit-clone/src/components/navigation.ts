import html from '../../../../src/html'

export default function navigation ({
  user = null,
  onAvatarClick,
}) {
  return html`
    <div class='pv3 h3 ttu b f6 flex items-center bb b--black-05'>
      <div class='flex-auto'>
        <span class='mr2'>Reddit Clone</span>
        <a class='mr2 no-underline blue' href='/posts/new'>
          New post
        </a>
        <a class='mr2 no-underline blue' href='/'>
          Posts
        </a>
      </div>
      <div>
        ${user
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
