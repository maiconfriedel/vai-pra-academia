import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const resetPasswordCodes = pgTable('reset_password_codes', {
  code: text('code')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at')
    .notNull()
    .default(sql`now() + interval '1 hour'`),
})
