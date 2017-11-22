import * as faker from 'faker'
import user, { User } from './user'

export interface AuthResponse {
  token: string
  user: User
}

export default function authResponse(): AuthResponse {
  return {
    token: faker.random.uuid,
    user: user(),
  }
}
