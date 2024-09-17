import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { users } from './'

export const levels = pgTable(
  'levels',
  {
    userId: text('user_id').references(() => users.id),
    year: integer('year').notNull(),
    level: integer('level').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.year] }),
    }
  },
)

export const levelsRelations = relations(levels, ({ one }) => {
  return {
    user: one(users, {
      fields: [levels.userId],
      references: [users.id],
      relationName: 'user_levels',
    }),
  }
})
