import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './'

export const friendships = pgTable(
  'friendships',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => users.id),
    friend_id: text('friend_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.user_id, table.friend_id] }),
    }
  },
)
