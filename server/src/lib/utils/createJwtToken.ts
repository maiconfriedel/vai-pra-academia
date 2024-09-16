import { env } from '@/env'
import dayjs from 'dayjs'
import { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'

type PayloadType = {
  id: string
  name: string
  email: string
  imageUrl: string | null
  desiredWeekFrequency: number
  profileVisibility: string
  notificationHour: string | null
}

export const createJwtToken = async (user: PayloadType, c: Context) => {
  const token = await sign(
    {
      user,
      exp: dayjs().add(7, 'day').unix(),
      iat: dayjs().unix(),
      nbf: dayjs().unix(),
    },
    env.JWT_TOKEN_SECRET,
    'HS256',
  )

  setCookie(c, 'auth', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}
