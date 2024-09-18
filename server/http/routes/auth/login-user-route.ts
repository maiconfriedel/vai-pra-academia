import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import { env } from '@server/env'
import dayjs from 'dayjs'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { sign } from 'hono/jwt'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginUserRoute = new Hono().post(
  '/',
  zValidator('json', loginSchema),
  async (c) => {
    const { email, password } = c.req.valid('json')

    const user = await db.query.users.findFirst({
      where(fields, { eq, and }) {
        return and(eq(fields.email, email), eq(fields.loginProvider, 'email'))
      },
    })

    if (!user) throw new HTTPException(404, { message: 'User not found' })

    const isValid = await Bun.password.verify(password, user.password!)

    if (!isValid) throw new HTTPException(404, { message: 'User not found' })

    const token = await sign(
      {
        user: {
          id: user.id,
          email: user.email,
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
  },
)
