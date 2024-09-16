import { integer, pgTable } from 'drizzle-orm/pg-core'

export const levelsConfiguration = pgTable('levels_configuration', {
  desiredWeekFrequency: integer('desired_week_frequency').primaryKey(),
  goalToLevelUp: integer('goal_to_level_up').notNull(),
})
