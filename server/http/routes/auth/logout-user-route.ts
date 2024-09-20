import { Hono } from 'hono'
import { deleteCookie } from 'hono/cookie'

export const logoutUserRoute = new Hono().get('/', async (c) => {
  deleteCookie(c, 'auth')

  return c.redirect('/')
})
