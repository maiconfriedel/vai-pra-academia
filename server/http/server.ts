import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { loginUserRoute } from './routes/login-user-route'
import { profileRoutes } from './routes/profile-routes'
import { registerUserRoute } from './routes/register-user-route'
import { registrationsRoutes } from './routes/registration-routes'

const app = new Hono()

app.use(logger())

app
  .basePath('/api/auth')
  .route('/register', registerUserRoute)
  .route('/login', loginUserRoute)
  .route('/me', profileRoutes)

app.basePath('/api/registrations').route('/', registrationsRoutes)

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message, details: err.cause }, err.status)
  }

  return c.json({ message: err.message }, 500)
})

export default app
