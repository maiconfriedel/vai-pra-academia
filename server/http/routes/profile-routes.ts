import { validateAuth } from '@/middlewares/auth'
import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import { calculateUserLevel } from '@server/db/functions/calculate-user-level'
import { users } from '@server/db/schema'
import dayjs from 'dayjs'
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
    const userId = c.var.user.id

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId!)
      },
      with: {
        levels: true,
      },
    })

    if (!user) {
      return c.text('', 404)
    }

    const ommitedUser = omit(user, ['password'])

    return c.json(
      {
        user: {
          ...ommitedUser,
          levels: ommitedUser.levels.map((lvl) => {
            return {
              year: lvl.year,
              level: lvl.level,
              updatedAt: lvl.updatedAt,
            }
          }),
        },
      },
      200,
    )
  })
  .patch('/', zValidator('json', updateProfileSchema), async (c) => {
    const userId = c.var.user.id

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

    if (desiredWeekFrequency) {
      const year = dayjs().year()
      await calculateUserLevel(userId!, year)
    }

    return c.text('', 204)
  })
