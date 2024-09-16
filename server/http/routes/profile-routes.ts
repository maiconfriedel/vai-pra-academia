import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import { users } from '@server/db/schema'
import { validateAuth } from '@server/http/middlewares/auth'
import { getPropertyFromUnknown } from '@server/lib/utils/getPropertyFromUnknown'
import { eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import omit from 'just-omit'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  desiredWeekFrequency: z.number().int().min(0).max(7).optional(),
  notificationHour: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .optional(),
  profileVisibility: z.enum(['public', 'private']).optional(),
})

export const profileRoutes = new Hono()
  .use(validateAuth)
  .get('/', async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId!)
      },
    })

    if (!user) {
      return c.text('', 404)
    }

    return c.json({ user: omit(user, ['password']) }, 200)
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

    await db
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

    return c.text('', 204)
  })