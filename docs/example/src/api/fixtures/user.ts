import * as faker from 'faker'

export interface User {
  username: string
  password: string
  name: string
  avatar: string
}

export default function user(): User {
  return {
    username: faker.internet.email(),
    password: faker.random.word(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    avatar: faker.image.avatar(),
  }
}
