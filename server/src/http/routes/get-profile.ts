import { Hono } from 'hono'
import { validateAuth } from '../middlewares/auth'

export const getProfileRoute = new Hono().use(validateAuth).get('/', (c) => {
  return c.json({ user: c.var.user }, 200)
})
