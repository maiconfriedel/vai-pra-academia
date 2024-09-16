import { validateAuth } from '@/middlewares/auth'
import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import { registrations as registrationsTable } from '@server/db/schema'
import { getPropertyFromUnknown } from '@server/lib/utils/getPropertyFromUnknown'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const createRegistrationSchema = z.object({
  date: z.string().date(),
  description: z.string().optional().nullable(),
})

export const registrationsRoutes = new Hono()
  .use(validateAuth)
  .get('/', async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')

    const registrations = await db
      .select()
      .from(registrationsTable)
      .where(eq(registrationsTable.userId, userId!))

    return c.json({ registrations }, 200)
  })
  .post('/', zValidator('json', createRegistrationSchema), async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')!

    const { date, description } = c.req.valid('json')

    await db
      .insert(registrationsTable)
      .values({
        userId,
        date,
        description,
      })
      .returning()

    return c.text('', 201)
  })
