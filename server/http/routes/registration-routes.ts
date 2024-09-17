import { validateAuth } from '@/middlewares/auth'
import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import { registrations as registrationsTable } from '@server/db/schema'
import { getPropertyFromUnknown } from '@server/lib/utils/getPropertyFromUnknown'
import { and, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const createRegistrationSchema = z.object({
  date: z.string().date(),
  description: z.string().optional().nullable(),
})

const updateRegistrationSchema = z.object({
  description: z.string().nullable(),
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
  .put('/:date', zValidator('json', updateRegistrationSchema), async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')!
    const date = c.req.param('date')

    const { description } = c.req.valid('json')

    await db
      .update(registrationsTable)
      .set({
        description,
        updatedAt: sql`now()`,
      })
      .where(
        and(
          eq(registrationsTable.userId, userId),
          eq(registrationsTable.date, date),
        ),
      )

    return c.text('', 204)
  })
  .delete('/:date', async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')!
    const date = c.req.param('date')

    await db
      .delete(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, userId),
          eq(registrationsTable.date, date),
        ),
      )

    return c.text('', 204)
  })
