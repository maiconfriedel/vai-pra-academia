import { validateAuth } from '@/middlewares/auth'
import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import {
  levels,
  levelsConfiguration,
  registrations as registrationsTable,
  users,
} from '@server/db/schema'
import { getPropertyFromUnknown } from '@server/lib/utils/getPropertyFromUnknown'
import dayjs from 'dayjs'
import { and, count, eq, sql } from 'drizzle-orm'
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
})

export const registrationsRoutes = new Hono()
  .use(validateAuth)
  .get('/', zValidator('query', getRegistrationSchema), async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')
    const { year } = c.req.valid('query')

    const registrations = await db
      .select()
      .from(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, userId!),
          year
            ? eq(sql`extract(year from ${registrationsTable.date})`, year)
            : undefined,
        ),
      )

    return c.json({ registrations }, 200)
  })
  .post('/', zValidator('json', createRegistrationSchema), async (c) => {
    const userId = getPropertyFromUnknown<string>(c.var.user, 'id')!

    const { date, description } = c.req.valid('json')

    console.log(date)

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

    const year = dayjs(date).year()

    const level = await db.query.levels.findFirst({
      where(fields, { and, eq }) {
        return and(eq(fields.userId, userId), eq(fields.year, year))
      },
    })

    if (level) {
      const registrationsCount = await db
        .select({
          count: count(registrationsTable.date),
          desiredWeekFrequency: users.desiredWeekFrequency,
          goalToLevelUp: levelsConfiguration.goalToLevelUp,
        })
        .from(registrationsTable)
        .innerJoin(users, eq(users.id, registrationsTable.userId))
        .innerJoin(
          levelsConfiguration,
          eq(
            levelsConfiguration.desiredWeekFrequency,
            users.desiredWeekFrequency,
          ),
        )
        .where(
          and(
            eq(registrationsTable.userId, userId),
            eq(sql`extract(year from ${registrationsTable.date})`, year),
          ),
        )
        .groupBy(users.desiredWeekFrequency, levelsConfiguration.goalToLevelUp)

      const level = Math.floor(
        registrationsCount[0].count / registrationsCount[0].goalToLevelUp,
      )

      await db
        .update(levels)
        .set({
          currentLevel: level,
        })
        .where(and(eq(levels.userId, userId), eq(levels.year, year)))
    } else {
      await db
        .insert(levels)
        .values({
          userId,
          year,
          currentLevel: 0,
        })
        .returning()
    }

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
