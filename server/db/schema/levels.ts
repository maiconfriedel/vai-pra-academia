import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './'

export const levels = pgTable('levels', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').references(() => users.id),
  currentLevel: integer('current_level').notNull().default(1),
  year: integer('year').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const levelsRelations = relations(levels, ({ one }) => {
  return {
    user: one(users, {
      fields: [levels.userId],
      references: [users.id],
      relationName: 'user_levels',
    }),
  }
})
