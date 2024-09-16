import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
} from 'drizzle-orm/pg-core'
import { levels, registrations } from '.'

export const profileVisibility = pgEnum('profile_visibility', [
  'public',
  'private',
])

export const loginProvider = pgEnum('login_provider', ['email', 'google'])

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  loginProvider: loginProvider('login_provider').notNull().default('email'),
  imageUrl: text('image_url'),
  desiredWeekFrequency: integer('desired_week_frequency').notNull().default(0),
  notificationHour: time('notification_hour'),
  profileVisibility: profileVisibility('profile_visibility')
    .notNull()
    .default('public'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  registrations: many(registrations),
  levels: many(levels),
}))
