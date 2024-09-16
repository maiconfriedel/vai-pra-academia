import { env } from '@/env'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import { JWTPayload } from 'hono/utils/jwt/types'

export const validateAuth = createMiddleware<{
  Variables: {
    user: JWTPayload['user']
  }
}>(async (c, next) => {
  const authCookie = getCookie(c, 'auth')

  if (!authCookie) throw new HTTPException(401, { message: 'Unauthorized' })

  try {
    const payload = await verify(authCookie!, env.JWT_TOKEN_SECRET, 'HS256')

    if (!payload) throw new HTTPException(401, { message: 'Unauthorized' })

    c.set('user', payload.user)
  } catch (err) {
    throw new HTTPException(401, { message: 'Unauthorized', cause: err })
  }

  await next()
})
