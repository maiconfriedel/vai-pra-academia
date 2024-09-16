import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { getProfileRoute } from './routes/get-profile'
import { loginUserRoute } from './routes/login-user'
import { registerUserRoute } from './routes/register-user'

const app = new Hono()

app.use(logger())

app
  .basePath('/api/auth')
  .route('/register', registerUserRoute)
  .route('/login', loginUserRoute)
  .route('/me', getProfileRoute)

export default app
