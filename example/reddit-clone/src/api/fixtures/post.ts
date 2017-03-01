import * as faker from 'faker'

export default function post () {
  return {
    title: faker.company.catchPhrase(),
    createdOn: faker.date.past().toString(),
    createdBy: `${faker.name.firstName()} ${faker.name.lastName()}`,
    comments: [1, 2, 3],
    votes: faker.random.number(99),
  }
}
