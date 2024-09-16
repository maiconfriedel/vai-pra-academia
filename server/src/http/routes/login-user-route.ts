import { db } from '@/db'
import { createJwtToken } from '@/lib/utils/createJwtToken'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import omit from 'just-omit'
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

    await createJwtToken(omit(user, ['password', 'createdAt', 'updatedAt']), c)

    return c.text('', 204)
  },
)
