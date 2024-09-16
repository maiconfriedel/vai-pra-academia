import { env } from '@/env'
import dayjs from 'dayjs'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'

export const loginUserRoute = new Hono().post('/', async (c) => {
  const token = await sign(
    {
      user: {
        id: 1,
        email: 'admin@admin.com',
      },
      exp: dayjs().add(7, 'day').unix(),
      iat: dayjs().unix(),
      nbf: dayjs().unix(),
    },
    env.JWT_TOKEN_SECRET,
    'HS256',
  )

  setCookie(c, 'auth', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return c.text('', 204)
})
