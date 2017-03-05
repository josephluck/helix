import html from '../../../../src/html'

export default function navigation ({
  user = null,
  onAvatarClick,
}) {
  return html`
    <div class='ph4 pv3 bg-white bb b--black-10 flex items-center h3 ttu tracked b f6'>
      <div class='flex-auto'>
        <span class='mr4'>Reddit Clone</span>
        <a class='mr3 no-underline blue'>
          New post
        </a>
        <a class='mr3 no-underline blue' href='/'>
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
