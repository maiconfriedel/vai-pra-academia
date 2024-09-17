import { and, count, eq, sql } from 'drizzle-orm'
import { db } from '..'
import {
  levels,
  levelsConfiguration,
  registrations as registrationsTable,
  users,
} from '../schema'

export const calculateUserLevel = async (userId: string, year: number) => {
  const [registrationsCount] = await db
    .select({
      count: count(registrationsTable.date),
      goalToLevelUp: levelsConfiguration.goalToLevelUp,
    })
    .from(registrationsTable)
    .innerJoin(users, eq(users.id, registrationsTable.userId))
    .innerJoin(
      levelsConfiguration,
      eq(levelsConfiguration.desiredWeekFrequency, users.desiredWeekFrequency),
    )
    .where(
      and(
        eq(registrationsTable.userId, userId),
        eq(sql`extract(year from ${registrationsTable.date})`, year),
      ),
    )
    .groupBy(levelsConfiguration.goalToLevelUp)

  const level = Math.floor(
    (registrationsCount?.count ?? 0) / registrationsCount.goalToLevelUp,
  )

  await db
    .insert(levels)
    .values({
      userId,
      year,
      level,
    })
    .onConflictDoUpdate({
      target: [levels.userId, levels.year],
      set: { level, updatedAt: sql`now()` },
    })
}
