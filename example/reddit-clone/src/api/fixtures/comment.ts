import * as faker from 'faker'
import user from './user'

export default function comment () {
  return {
    uuid: faker.random.uuid(),
    createdOn: faker.date.past().toString(),
    createdBy: user(),
    body: faker.lorem.paragraph(),
  }
}
