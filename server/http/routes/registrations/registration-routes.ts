import { validateAuth } from '@/middlewares/auth'
import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import { calculateUserLevel } from '@server/db/functions/calculate-user-level'
import { registrations as registrationsTable } from '@server/db/schema'
import dayjs from 'dayjs'
import { and, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

const createRegistrationSchema = z.object({
  date: z.string().date(),
  description: z.string().optional().nullable(),
})

const updateRegistrationSchema = z.object({
  description: z.string().nullable(),
})

const getRegistrationSchema = z.object({
  year: z
    .string()
    .optional()
    .transform((v) => (v === '' ? undefined : Number.parseInt(v!))),
  month: z
    .string()
    .optional()
    .transform((v) => (v === '' ? undefined : Number.parseInt(v!))),
})

export const registrationsRoutes = new Hono()
  .use(validateAuth)
  .get('/', zValidator('query', getRegistrationSchema), async (c) => {
    const userId = c.var.user.id
    const { year, month } = c.req.valid('query')

    const registrations = await db
      .select()
      .from(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, userId!),
          year
            ? eq(sql`extract(year from ${registrationsTable.date})`, year)
            : undefined,
          month
            ? eq(sql`extract(month from ${registrationsTable.date})`, month)
            : undefined,
        ),
      )

    return c.json({ count: registrations.length, registrations }, 200)
  })
  .post('/', zValidator('json', createRegistrationSchema), async (c) => {
    const userId = c.var.user.id

    const { date, description } = c.req.valid('json')

    const year = dayjs(date).year()
    const currentYear = dayjs().year()

    if (year !== currentYear) {
      throw new HTTPException(400, {
        message: 'You can only register for the current year',
      })
    }

    const existingRegistration = await db.query.registrations.findFirst({
      where(fields, { eq, and }) {
        return and(eq(fields.userId, userId), eq(fields.date, date))
      },
    })

    if (existingRegistration)
      throw new HTTPException(409, {
        message: 'Registration already exists for this date',
      })

    await db
      .insert(registrationsTable)
      .values({
        userId,
        date,
        description,
      })
      .returning()

    await calculateUserLevel(userId, year)

    return c.text('', 201)
  })
  .put('/:date', zValidator('json', updateRegistrationSchema), async (c) => {
    const userId = c.var.user.id
    const date = c.req.param('date')

    const year = dayjs(date).year()
    const currentYear = dayjs().year()

    if (year !== currentYear) {
      throw new HTTPException(400, {
        message: 'You cannot update registrations from previous years',
      })
    }

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
    const userId = c.var.user.id
    const date = c.req.param('date')

    const year = dayjs(date).year()
    const currentYear = dayjs().year()

    if (year !== currentYear) {
      throw new HTTPException(400, {
        message: 'You cannnot delete registrations from previous years',
      })
    }

    await db
      .delete(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, userId),
          eq(registrationsTable.date, date),
        ),
      )

    await calculateUserLevel(userId, year)

    return c.text('', 204)
  })
