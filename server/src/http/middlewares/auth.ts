import { env } from '@/env'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { JWTPayload } from 'hono/utils/jwt/types'

export const validateAuth = createMiddleware<{
  Variables: {
    user: JWTPayload['user']
  }
}>(async (c, next) => {
  const authCookie = getCookie(c, 'auth')
  console.log('authCookie', authCookie)

  if (!authCookie) return c.json({ message: 'Unauthorized' }, 401)

  try {
    const payload = await verify(authCookie!, env.JWT_TOKEN_SECRET, 'HS256')

    if (!payload) return c.json({ message: 'Unauthorized' }, 401)

    c.set('user', payload.user)
  } catch (error) {
    return c.json({ message: 'Unauthorized', error }, 401)
  }

  await next()
})
