import { relations } from 'drizzle-orm'
import { date, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './'

export const registrations = pgTable(
  'registrations',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    date: date('date').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.date] }),
    }
  },
)

export const registrationsRelations = relations(registrations, ({ one }) => {
  return {
    user: one(users, {
      fields: [registrations.userId],
      references: [users.id],
      relationName: 'registrations',
    }),
  }
})
