import { env } from '@server/env'
import { getPropertyFromUnknown } from '@server/lib/utils/get-property-from-unknown'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'

export const validateAuth = createMiddleware<{
  Variables: {
    user: {
      id: string
      email: string
    }
  }
}>(async (c, next) => {
  const authCookie = getCookie(c, 'auth')

  if (!authCookie) throw new HTTPException(401, { message: 'Unauthorized' })

  try {
    const payload = await verify(authCookie!, env.JWT_TOKEN_SECRET, 'HS256')

    if (!payload) throw new HTTPException(401, { message: 'Unauthorized' })

    c.set('user', {
      id: getPropertyFromUnknown<string>(payload, 'id')!,
      email: getPropertyFromUnknown<string>(payload, 'email')!,
    })
  } catch (err) {
    throw new HTTPException(401, { message: 'Unauthorized', cause: err })
  }

  await next()
})
