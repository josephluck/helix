import * as faker from 'faker'
import user, { User } from './user'

export interface Comment {
  uuid: string
  createdOn: Date
  createdBy: User
  body: string
}

export default function comment(): Comment {
  return {
    uuid: faker.random.uuid(),
    createdOn: faker.date.past(),
    createdBy: user(),
    body: faker.lorem.paragraph(),
  }
}
