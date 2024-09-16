import { db } from '@/db'
import { users } from '@/db/schema'
import { validateAuth } from '@/http/middlewares/auth'
import { createJwtToken } from '@/lib/utils/createJwtToken'
import { getPropertyFromUnknown } from '@/lib/utils/getPropertyFromUnknown'
import { zValidator } from '@hono/zod-validator'
import { eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import omit from 'just-omit'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.string().url().optional(),
  desiredWeekFrequency: z.number().int().min(0).max(7).optional(),
  notificationHour: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .optional(),
  profileVisibility: z.enum(['public', 'private']).optional(),
})

export const profileRoutes = new Hono()
  .use(validateAuth)
  .get('/', (c) => {
    return c.json({ user: c.var.user }, 200)
  })
  .patch('/', zValidator('json', updateProfileSchema), async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')

    const {
      name,
      imageUrl,
      profileVisibility,
      notificationHour,
      desiredWeekFrequency,
    } = c.req.valid('json')

    const value = await db
      .update(users)
      .set({
        name,
        imageUrl,
        profileVisibility,
        notificationHour,
        desiredWeekFrequency,
        updatedAt: sql`now()`,
      })
      .where(eq(users.id, userId!))
      .returning()

    const user = value[0]

    // create a new token with the updated user
    await createJwtToken(omit(user, ['password', 'createdAt', 'updatedAt']), c)

    return c.text('', 204)
  })
