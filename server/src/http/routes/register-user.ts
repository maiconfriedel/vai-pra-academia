import { Hono } from 'hono'

export const registerUserRoute = new Hono().post('/', (c) => {
  return c.json({ message: 'User registered' }, 201)
})
