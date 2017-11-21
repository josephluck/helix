import * as faker from 'faker'

export default function user () {
  return {
    username: faker.internet.email(),
    password: faker.random.word(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    avatar: faker.image.avatar(),
  }
}
