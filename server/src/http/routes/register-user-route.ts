import { db } from '@/db'
import { users } from '@/db/schema'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import omit from 'just-omit'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  imageUrl: z.string().url().optional(),
  notificationHour: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .optional(),
  profileVisibility: z.enum(['public', 'private']).optional(),
  desiredWeekFrequency: z.number().int().min(0).max(7),
})

export const registerUserRoute = new Hono().post(
  '/',
  zValidator('json', registerSchema),
  async (c) => {
    let {
      name,
      email,
      password,
      desiredWeekFrequency,
      imageUrl,
      notificationHour,
      profileVisibility,
    } = c.req.valid('json')

    password = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 4,
    })

    const user = await db
      .insert(users)
      .values({
        name,
        email,
        password,
        desiredWeekFrequency,
        imageUrl,
        notificationHour,
        profileVisibility,
      })
      .returning()

    return c.json({ user: omit(user[0], ['password']) }, 201)
  },
)
