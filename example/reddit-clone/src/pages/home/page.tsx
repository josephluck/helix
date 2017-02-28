import { h } from '../../../../../src/html'

function Page ({state, actions}) {
  return (
    <div>
      {state.pages.home.posts.map(post => (
        <div>
          {post}
        </div>
      ))}
    </div>
  )
}

export default function home (props) {
  return (
    <div>
      Hey
    </div>
  )
}
