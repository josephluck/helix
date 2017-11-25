import * as faker from 'faker'

import comment, { Comment } from './comment'
import user, { User } from './user'

export interface Post {
  uuid: string
  title: string
  createdOn: string
  createdBy: User
  comments: Comment[]
  votes: number
  body: string[]
}

export default function post(): Post {
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
