import { h } from '../../../../src/html'

export default function navigation ({
  user = null,
  onLogoutClick,
}) {
  return (
    <div class='ph4 pv3 bg-white bb b--black-10 flex items-center h3'>
      <div class='flex-auto'>
        <a class='mr3'>
          New post
        </a>
        <a class='mr3' href='/'>
          Posts
        </a>
      </div>
      <div>
        {user
          ? (
            <div class='inline-flex items-center'>
              <img class='mr2 br-pill w2 h2 overflow-hidden' src={user.avatar} />
              <span class='div mr2'>{user.name}</span>
              <a onclick={onLogoutClick} href='/'>Logout</a>
            </div>
          )
          : (
            <a class='ml3' href='/login'>
              Login
            </a>
          )
        }
      </div>
    </div>
  )
}
