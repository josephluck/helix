import * as faker from 'faker'

export const fixture = {
  username: faker.internet.email(),
  password: faker.random.word(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  avatar: faker.image.avatar(),
}

export default function user () {
  return fixture
}
