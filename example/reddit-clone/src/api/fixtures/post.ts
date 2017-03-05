import * as faker from 'faker'

import comment from './comment'
import user from './user'

export default function post () {
  return {
    uuid: faker.random.uuid(),
    title: faker.company.catchPhrase(),
    createdOn: faker.date.past().toString(),
    createdBy: user(),
    comments: Array.from({ length: Math.random() * 10 }).map(comment),
    votes: faker.random.number(99),
    body: Array.from({ length: 4 }).map(faker.lorem.paragraphs),
  }
}
