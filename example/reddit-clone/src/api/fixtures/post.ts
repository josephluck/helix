import * as faker from 'faker'

export default function post () {
  return {
    title: faker.lorem.sentence(),
    createdOn: faker.date.past().toString(),
    createdBy: faker.name.firstName(),
    comments: [1, 2, 3]
  }
}
