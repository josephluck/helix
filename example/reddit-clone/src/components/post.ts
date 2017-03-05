import html from '../../../../src/html'
import * as moment from 'moment'

export default function renderPost (post) {
  return html`
    <div class='bb b--black-10 bg-white pa3 flex items-center'>
      <div class='f4 w2 tc mr3 light-silver bold tracked flex flex-column'>${post.votes}</div>
      <div>
        <a class='f3 pb2 blue no-underline' href=${`/posts/${post.uuid}`}>${post.title}</a>
        <div class='gray f6 mt1'>
          <div class='mb1'>
            submitted ${moment(post.createdOn).fromNow()} by ${post.createdBy}
          </div>
          <div>${post.comments.length} comments</div>
        </div>
      </div>
    </div>
  `
}
