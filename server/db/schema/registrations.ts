import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { date, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './'

export const registrations = pgTable('registrations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  date: date('date').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

export const registrationsRelations = relations(registrations, ({ one }) => {
  return {
    user: one(users, {
      fields: [registrations.userId],
      references: [users.id],
      relationName: 'registrations',
    }),
  }
})
