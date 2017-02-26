import * as faker from 'faker'
import user from './user'

export default function authResponse () {
  return {
    token: faker.random.uuid,
    user: user(),
  }
}