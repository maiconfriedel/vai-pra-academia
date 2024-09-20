import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { loginUserRoute } from './routes/auth/login-user-route'
import { logoutUserRoute } from './routes/auth/logout-user-route'
import { profileRoutes } from './routes/auth/profile-routes'
import { registerUserRoute } from './routes/auth/register-user-route'
import { resetPasswordRoutes } from './routes/auth/reset-password-routes'
import { registrationsRoutes } from './routes/registrations/registration-routes'

const app = new Hono()

app.use(logger())

const authRoutes = app
  .basePath('/api/auth')
  .route('/register', registerUserRoute)
  .route('/login', loginUserRoute)
  .route('/logout', logoutUserRoute)
  .route('/me', profileRoutes)
  .route('/password', resetPasswordRoutes)

const registrationRoutes = app
  .basePath('/api/registrations')
  .route('/', registrationsRoutes)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message, details: err.cause }, err.status)
  }

  return c.json({ message: err.message }, 500)
})

export default app
export type ApiRoutes = typeof authRoutes & typeof registrationRoutes
