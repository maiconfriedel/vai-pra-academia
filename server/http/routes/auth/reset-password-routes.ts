import { zValidator } from '@hono/zod-validator'
import { db } from '@server/db'
import { resetPasswordCodes, users } from '@server/db/schema'
import { validateAuth } from '@server/http/middlewares/auth'
import { sendEmail } from '@server/lib/utils/send-email'
import dayjs from 'dayjs'
import { and, eq, gt } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  password: z.string().min(6),
  code: z.string().min(1),
})

export const resetPasswordRoutes = new Hono()
  .use(validateAuth)
  .post('/reset', async (c) => {
    const userId = c.var.user.id

    const [code] = await db
      .insert(resetPasswordCodes)
      .values({
        userId,
      })
      .returning()

    console.log(code)

    // TODO - Better email template
    sendEmail({
      subject: 'Vai pra Academia - Solicitação de redefinição de senha',
      text: `<html>
              <body style="font-family: Arial, Helvetica, sans-serif">
                <h1>Redefinir senha</h1>
                <p>Olá, clique no link abaixo para redefinir sua senha:</p>
                <a href="http://localhost:3000/api/auth/password/reset?code=${code.code}"
                  >Redefinir senha</a
                >
              </body>
            </html>`,
      to: c.var.user.email,
    })

    return c.text('', 204)
  })
  .get('/reset', async (c) => {
    const { code } = c.req.query()
    if (!code) throw new HTTPException(400, { message: 'Code is required' })

    const today = dayjs().toDate()

    const [resetPasswordCode] = await db
      .select()
      .from(resetPasswordCodes)
      .where(
        and(
          eq(resetPasswordCodes.code, code),
          gt(resetPasswordCodes.expiresAt, today),
        ),
      )

    if (!resetPasswordCode) {
      return c.json({ message: 'Invalid reset password code' }, 400)
    }

    // frontend
    return c.redirect(`/reset-password?code=${code}`)
  })
  .put('/', zValidator('json', resetPasswordSchema), async (c) => {
    let { password, code } = c.req.valid('json')

    const today = dayjs().toDate()

    const [resetPasswordCode] = await db
      .select()
      .from(resetPasswordCodes)
      .where(
        and(
          eq(resetPasswordCodes.code, code),
          gt(resetPasswordCodes.expiresAt, today),
        ),
      )

    if (!resetPasswordCode) {
      return c.json({ message: 'Invalid reset password code' }, 400)
    }

    password = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 4,
    })

    await db
      .update(users)
      .set({ password })
      .where(eq(users.id, resetPasswordCode.userId))

    await db.delete(resetPasswordCodes).where(eq(resetPasswordCodes.code, code))

    return c.text('', 204)
  })
